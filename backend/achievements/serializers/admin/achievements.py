from rest_framework import serializers
from achievements.models import Achievement

class AdminAchievementSerializer(serializers.ModelSerializer):
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
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["achievement_id", "created_at", "updated_at"]
