from rest_framework import generics, permissions
from streaks.models import DailyStreak
from streaks.serializers.admin.daily_streaks import AdminDailyStreakSerializer
from users.permissions import IsAdminRole

class AdminListDailyStreaksView(generics.ListCreateAPIView):
    queryset = DailyStreak.objects.select_related("user").all()
    serializer_class = AdminDailyStreakSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class AdminManageDailyStreakView(generics.RetrieveDestroyAPIView):
    queryset = DailyStreak.objects.select_related("user").all()
    serializer_class = AdminDailyStreakSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "daily_streak_id"
