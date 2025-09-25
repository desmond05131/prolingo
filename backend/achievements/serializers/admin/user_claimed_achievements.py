from rest_framework import serializers
from achievements.models import UserClaimedAchievement


class AdminUserClaimedAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserClaimedAchievement
        fields = [
            "user_claimed_achievement_id",
            "user",
            "achievement",
            "claimed_date",
        ]
        read_only_fields = ["user_claimed_achievement_id", "claimed_date"]

