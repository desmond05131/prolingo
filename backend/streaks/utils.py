from __future__ import annotations

from datetime import timedelta
import datetime
from traceback import print_list
from django.utils import timezone
from django.db.models import QuerySet

from .models import DailyStreak


def _dates_for_user(user) -> QuerySet[DailyStreak]:
	"""Return user streaks ordered desc by date.

	Note: We only need the date and saver flag for streak calculations.
	"""
	return (
		DailyStreak.objects.filter(user=user)
		.only("daily_streak_date", "is_streak_saver")
		.order_by("-daily_streak_date", "-daily_streak_id")
	)


def compute_current_streak(user) -> int:
	"""Compute number of consecutive days ending at today.

	A day counts if there is a DailyStreak entry for that calendar date
	regardless of is_streak_saver value.
	"""
	today = datetime.date.today()
	streak = 0
	expected = today
	for ds in _dates_for_user(user):
		d = ds.daily_streak_date
		if d == expected or d == expected - timedelta(days=1):
			streak += 1
			expected = expected - timedelta(days=1)
			continue
		# If we've already started counting and we hit a gap, stop.
		if d < expected:
			break
		# If d > expected, just skip (future dates shouldn't exist, but safe)
	return streak


def compute_longest_streak(user) -> int:
	"""Compute the longest run of consecutive days across all records for user.

	Complexity: O(n) over number of streak days; safe for typical usage.
	"""
	qs = list(_dates_for_user(user))
	if not qs:
		return 0

	longest = 1
	current = 1
	for i in range(1, len(qs)):
		prev = qs[i - 1].daily_streak_date
		cur = qs[i].daily_streak_date
		# Dates are in descending order; consecutive if prev == cur + 1 day
		if prev - cur == timedelta(days=1):
			current += 1
		elif prev == cur:
			# Same-day duplicates should not exist due to unique constraint,
			# but in case of legacy data just ignore and continue current.
			continue
		else:
			longest = max(longest, current)
			current = 1
	longest = max(longest, current)
	return longest


__all__ = ["compute_current_streak", "compute_longest_streak"]

