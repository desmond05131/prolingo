from rest_framework import serializers
from streaks.models import DailyStreak

class AdminDailyStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyStreak
        fields = [
            "daily_streak_id",
            "user",
            "daily_streak_date",
        ]
        read_only_fields = ["daily_streak_id"]
