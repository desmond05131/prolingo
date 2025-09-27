from rest_framework import serializers
from streaks.models import DailyStreak

class AdminDailyStreakSerializer(serializers.ModelSerializer):
    # return username
    username = serializers.CharField(source="user.username", read_only=True)
    class Meta:
        model = DailyStreak
        fields = [
            "daily_streak_id",
            "user",
            "username",
            "daily_streak_date",
            "is_streak_saver",
        ]
        read_only_fields = ["daily_streak_id"]
