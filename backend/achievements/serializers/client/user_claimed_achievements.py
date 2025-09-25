from rest_framework import serializers
from achievements.models import UserClaimedAchievement


class ClientUserClaimedAchievementSerializer(serializers.ModelSerializer):
    achievement_id = serializers.IntegerField(source="achievement.achievement_id", read_only=True)

    class Meta:
        model = UserClaimedAchievement
        fields = [
            "user_claimed_achievement_id",
            "achievement_id",
            "claimed_date",
        ]
        read_only_fields = fields
