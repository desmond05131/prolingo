from rest_framework import generics, permissions
from streaks.models import DailyStreak
from streaks.serializers.client.daily_streaks import ClientDailyStreakSerializer
from django.utils import timezone

class ClientMyDailyStreaksView(generics.ListAPIView):
    serializer_class = ClientDailyStreakSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailyStreak.objects.filter(user=self.request.user).order_by("-daily_streak_date")

class ClientCreateTodayDailyStreakView(generics.CreateAPIView):
    serializer_class = ClientDailyStreakSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Enforce uniqueness at application level to provide clearer error than DB IntegrityError
        today = timezone.now().date()
        if DailyStreak.objects.filter(user=self.request.user, daily_streak_date=today).exists():
            # Simply return existing without creating new duplicate
            # Alternative: raise ValidationError
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"detail": "Today's streak already recorded"})
        serializer.save(user=self.request.user, daily_streak_date=today)
