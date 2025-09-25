from rest_framework import serializers
from achievements.models import Achievement

class ClientAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = [
            "achievement_id",
            "reward_type",
            "reward_amount",
            "reward_content",
            "reward_content_description",
        ]
        read_only_fields = fields
