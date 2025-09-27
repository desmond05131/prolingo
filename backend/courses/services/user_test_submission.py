from __future__ import annotations

from dataclasses import dataclass
import datetime
from typing import Iterable, List

from django.db import transaction
from django.utils import timezone

from courses.models import Test, Question, UserTest, UserTestAnswer
from common.constants import (
    XP_AWARD_PER_TEST,
    XP_AWARD_PER_PRACTICE,
    ENERGY_COST_PER_TEST,
    ENERGY_COST_PER_PRACTICE,
)
from gameinfo.models import UserGameInfos
from streaks.models import DailyStreak


@dataclass
class SubmissionAnswer:
    question_id: int
    answer_text: str


@dataclass
class SubmissionResult:
    user_test: UserTest
    answers: List[UserTestAnswer]
    total_questions: int
    answered_count: int
    correct_count: int
    xp_awarded: int
    energy_spent: int
    streak_created: bool


def _normalize_answer(text: str) -> str:
    if text is None:
        return ""
    return str(text).strip().casefold()


@transaction.atomic
def submit_user_test(
    *,
    user,
    test_id: int,
    duration: int,
    answers: Iterable[SubmissionAnswer],
) -> SubmissionResult:
    """Create a UserTest with answers, update daily streak, energy and XP.

    Assumptions:
    - Energy cost per submission = 1.
    - XP = 10 per correct answer (before premium multiplier); multiplier applied in add_xp().
    - Only accepts questions that belong to the given test; unknown question_ids are ignored with error.
    """

    # Validate and fetch test (must be in an active course)
    test = (
        Test.objects.select_related("chapter", "chapter__course")
        .filter(test_id=test_id, chapter__course__status="active")
        .first()
    )
    if not test:
        raise ValueError("Invalid test_id or test not active")

    # First attempt vs practice (redo): if user already has any submission for this test, treat as practice
    is_practice = UserTest.objects.filter(user=user, test_id=test_id).exists()

    # Fetch questions for the test
    questions = (
        Question.objects.filter(test_id=test_id)
        .only("question_id", "correct_answer_text")
        .order_by("order_index", "question_id")
    )
    question_map = {q.question_id: q for q in questions}
    total_questions = questions.count()

    # Validate incoming answers
    seen: set[int] = set()
    prepared: list[tuple[int, str, bool]] = []  # (question_id, given_text, is_correct)
    correct_count = 0

    for a in answers:
        qid = int(getattr(a, "question_id", None))
        given = str(getattr(a, "answer_text", "") or "")
        if not qid or qid not in question_map:
            raise ValueError(f"Invalid question_id: {qid}")
        if qid in seen:
            raise ValueError(f"Duplicate answer for question_id: {qid}")
        seen.add(qid)
        q = question_map[qid]
        is_correct = _normalize_answer(given) == _normalize_answer(q.correct_answer_text)
        if is_correct:
            correct_count += 1
        prepared.append((qid, given, is_correct))

    # Create the user test first (we'll update with scoring fields below)
    user_test = UserTest.objects.create(user=user, test=test, time_spent=max(0, int(duration or 0)))

    # Persist answers (model doesn't store question reference; store text + correctness only)
    uta_list: list[UserTestAnswer] = []
    for _qid, given_text, is_correct in prepared:
        uta_list.append(UserTestAnswer(user_test=user_test, given_answer_text=given_text, is_correct=is_correct))
    if uta_list:
        UserTestAnswer.objects.bulk_create(uta_list)
        # Reload with IDs
        uta_list = list(UserTestAnswer.objects.filter(user_test=user_test).order_by("user_test_answer_id"))

    # Daily streak: ensure today is marked
    today = datetime.date.today()
    print(today)
    _, streak_created = DailyStreak.objects.get_or_create(user=user, daily_streak_date=today)

    # Energy and XP updates
    gameinfo, _ = UserGameInfos.objects.select_for_update().get_or_create(user=user)
    # Apply passive regen before spending
    try:
        gameinfo.apply_passive_energy_regen()
    except Exception:
        pass
    # Spend energy according to attempt type
    energy_spent = ENERGY_COST_PER_PRACTICE if is_practice else ENERGY_COST_PER_TEST
    try:
        gameinfo.decrement_energy(energy_spent)
    except Exception:
        pass

    # Award XP according to attempt type
    xp_awarded = XP_AWARD_PER_PRACTICE if is_practice else XP_AWARD_PER_TEST
    if xp_awarded:
        try:
            xp_awarded = gameinfo.add_xp(xp_awarded)
        except Exception:
            pass

    # Update scoring fields on the created user_test
    # Use total number of questions in the test for percentage; avoid division by zero
    percentage = 0
    if total_questions > 0:
        percentage = int(round((correct_count / total_questions) * 100))
    # Persist computed fields
    UserTest.objects.filter(pk=user_test.pk).update(
        correct_answer_count=correct_count,
        score_count=percentage,
    )
    # Refresh instance values
    user_test.correct_answer_count = correct_count
    user_test.score_count = percentage

    return SubmissionResult(
        user_test=user_test,
        answers=uta_list,
        total_questions=total_questions,
        answered_count=len(prepared),
        correct_count=correct_count,
        xp_awarded=xp_awarded,
        energy_spent=energy_spent,
        streak_created=streak_created,
    )
