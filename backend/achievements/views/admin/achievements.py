from rest_framework import generics, permissions
from achievements.models import Achievement
from achievements.serializers.admin.achievements import AdminAchievementSerializer
from users.permissions import IsAdminRole

class AdminListAchievementsView(generics.ListCreateAPIView):
    queryset = Achievement.objects.all()
    serializer_class = AdminAchievementSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class AdminManageAchievementView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Achievement.objects.all()
    serializer_class = AdminAchievementSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "achievement_id"
