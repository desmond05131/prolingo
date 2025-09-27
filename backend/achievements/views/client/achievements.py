from rest_framework import generics, permissions
from achievements.models import Achievement
from achievements.serializers.client.achievements import ClientAchievementSerializer

class ClientListAchievementsView(generics.ListAPIView):
    queryset = Achievement.objects.all().order_by("-achievement_id")
    serializer_class = ClientAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
