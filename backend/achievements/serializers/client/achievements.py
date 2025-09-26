from rest_framework import serializers
from achievements.models import Achievement, UserClaimedAchievement
from gameinfo.models import UserGameInfos
from streaks.utils import compute_current_streak
from courses.models import UserTest

class ClientAchievementSerializer(serializers.ModelSerializer):
    # Per-user computed fields (read-only)
    current_progress_xp = serializers.SerializerMethodField()
    current_progress_streak = serializers.SerializerMethodField()
    claimed = serializers.SerializerMethodField()
    claimable = serializers.SerializerMethodField()
    class Meta:
        model = Achievement
        fields = [
            "achievement_id",
            "target_xp_value",
            "target_streak_value",
            "target_completed_test_id",
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
