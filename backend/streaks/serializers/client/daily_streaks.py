from rest_framework import serializers
from streaks.models import DailyStreak

class ClientDailyStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyStreak
        fields = [
            "daily_streak_id",
            "daily_streak_date",
            "is_streak_saver",
        ]
        read_only_fields = ["daily_streak_id", "daily_streak_date", "is_streak_saver"]
