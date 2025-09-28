from rest_framework import serializers
from achievements.models import Achievement, UserClaimedAchievement
from gameinfo.models import UserGameInfos
from streaks.utils import compute_current_streak
from courses.models import UserTest, Test

class ClientAchievementSerializer(serializers.ModelSerializer):
    # Per-user computed fields (read-only)
    current_progress_xp = serializers.SerializerMethodField()
    current_progress_streak = serializers.SerializerMethodField()
    claimed = serializers.SerializerMethodField()
    claimable = serializers.SerializerMethodField()
    # Display for target_completed_test_id: "course.title - chapter.title - test.title"
    target_completed_test_display = serializers.SerializerMethodField()
    class Meta:
        model = Achievement
        fields = [
            "achievement_id",
            "target_xp_value",
            "target_streak_value",
            "target_completed_test_id",
            "target_completed_test_display",
            "reward_type",
            "reward_amount",
            "reward_content",
            "reward_content_description",
            # Per-user additions
            "current_progress_xp",
            "current_progress_streak",
            "claimed",
            "claimable",
        ]
        read_only_fields = fields

    # Caching helpers to avoid recomputing per row
    def _get_user(self):
        request = self.context.get("request") if self.context else None
        return getattr(request, "user", None)

    def _get_user_xp(self) -> int:
        if hasattr(self, "_cached_user_xp"):
            return self._cached_user_xp
        user = self._get_user()
        xp = 0
        if user and user.is_authenticated:
            gi = getattr(user, "gameinfo", None)
            if gi is None:
                # Ensure we don't create rows from serializer; just read if exists
                gi = UserGameInfos.objects.filter(user=user).only("xp_value").first()
            xp = gi.xp_value if gi else 0
        self._cached_user_xp = int(xp or 0)
        return self._cached_user_xp

    def _get_user_current_streak(self) -> int:
        if hasattr(self, "_cached_current_streak"):
            return self._cached_current_streak
        user = self._get_user()
        streak = 0
        if user and user.is_authenticated:
            streak = compute_current_streak(user)
        self._cached_current_streak = int(streak or 0)
        return self._cached_current_streak

    def get_current_progress_xp(self, obj: Achievement) -> int:
        return self._get_user_xp()

    def get_current_progress_streak(self, obj: Achievement) -> int:
        return self._get_user_current_streak()

    def get_claimed(self, obj: Achievement) -> bool:
        user = self._get_user()
        if not (user and user.is_authenticated):
            return False
        return UserClaimedAchievement.objects.filter(user=user, achievement=obj).exists()

    def get_claimable(self, obj: Achievement) -> bool:
        """Claimable if all set targets are satisfied and not already claimed.

        Targets semantics: AND over the provided (non-null) targets.
        - XP target: user's total xp >= target_xp_value
        - Streak target: user's current streak >= target_streak_value
        - Completed test target: best-effort check using UserTest by test_id.
          Note: Achievement.target_completed_test_id is a placeholder pointing to a
          future 'completed test result' model. Until that exists, treat the value
          as a courses.Test id and consider claimable if the user has any UserTest
          row for that test.
        """
        user = self._get_user()
        if not (user and user.is_authenticated):
            return False

        # If already claimed, it's not claimable
        if UserClaimedAchievement.objects.filter(user=user, achievement=obj).exists():
            return False

        # Check each criterion that is set
        if obj.target_xp_value is not None:
            if self._get_user_xp() < int(obj.target_xp_value):
                return False

        if obj.target_streak_value is not None:
            if self._get_user_current_streak() < int(obj.target_streak_value):
                return False

        if obj.target_completed_test_id is not None:
            # Best-effort: interpret as courses.Test id
            has_completed = UserTest.objects.filter(user=user, test_id=obj.target_completed_test_id).exists()
            if not has_completed:
                return False

        return True

    # ---------- Target test display helpers ----------
    def _build_test_map_if_needed(self, current_obj: Achievement | None = None) -> None:
        """Build a cache map of test_id -> Test with related chapter & course to avoid N+1.

        Tries to gather all target_completed_test_id values from the list serializer's
        instance if available, plus the current object as a fallback.
        """
        if hasattr(self, "_cached_test_map"):
            return

        ids = set()
        if self.parent is not None and hasattr(self.parent, "instance"):
            try:
                for a in self.parent.instance or []:
                    tid = getattr(a, "target_completed_test_id", None)
                    if tid is not None:
                        ids.add(int(tid))
            except TypeError:
                # parent.instance may be a single object or non-iterable
                pass

        if current_obj is not None and current_obj.target_completed_test_id is not None:
            ids.add(int(current_obj.target_completed_test_id))

        if ids:
            tests = (
                Test.objects.filter(test_id__in=ids)
                .select_related("chapter__course")
                .only("test_id", "title", "chapter__title", "chapter__course__title")
            )
            self._cached_test_map = {t.test_id: t for t in tests}
        else:
            self._cached_test_map = {}

    def _get_test_for(self, test_id: int) -> Test | None:
        self._build_test_map_if_needed()
        return self._cached_test_map.get(int(test_id))

    def get_target_completed_test_display(self, obj: Achievement) -> str | None:
        """Return "course.title - chapter.title - test.title" for the target test if known."""
        tid = obj.target_completed_test_id
        if tid is None:
            return None

        # Build cache with current object to ensure availability when serializing single item
        self._build_test_map_if_needed(obj)
        t = self._get_test_for(tid)
        if not t:
            return None
        # Defensive: handle missing relations
        chapter = getattr(t, "chapter", None)
        course = getattr(chapter, "course", None) if chapter else None
        course_title = getattr(course, "title", None) or ""
        chapter_title = getattr(chapter, "title", None) or ""
        test_title = getattr(t, "title", None) or ""
        # If any parts are missing, best-effort join of available titles
        parts = [p for p in [course_title, chapter_title, test_title] if p]
        return " - ".join(parts) if parts else None
