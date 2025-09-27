from rest_framework import generics, permissions
from achievements.models import UserClaimedAchievement
from achievements.serializers.admin import AdminUserClaimedAchievementSerializer
from users.permissions import IsAdminRole


class AdminListUserClaimedAchievementsView(generics.ListCreateAPIView):
    queryset = (
        UserClaimedAchievement.objects.select_related("user", "achievement")
        .all()
        .order_by("-user_claimed_achievement_id")
    )
    serializer_class = AdminUserClaimedAchievementSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]


class AdminManageUserClaimedAchievementView(generics.RetrieveDestroyAPIView):
    queryset = UserClaimedAchievement.objects.select_related("user", "achievement").all()
    serializer_class = AdminUserClaimedAchievementSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "user_claimed_achievement_id"
