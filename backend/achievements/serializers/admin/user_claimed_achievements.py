from rest_framework import serializers
from achievements.models import UserClaimedAchievement


class AdminUserClaimedAchievementSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    achievement_reward_type = serializers.ReadOnlyField(source="achievement.reward_type")
    achievement_reward_amount = serializers.ReadOnlyField(source="achievement.reward_amount")
    achievement_reward_content_description = serializers.ReadOnlyField(source="achievement.reward_content_description")
    
    class Meta:
        model = UserClaimedAchievement
        fields = [
            "user_claimed_achievement_id",
            "user",
            "username",
            "achievement",
            "achievement_reward_type",
            "achievement_reward_amount",
            "achievement_reward_content_description",
            "claimed_date",
        ]
        read_only_fields = ["user_claimed_achievement_id", "claimed_date"]

