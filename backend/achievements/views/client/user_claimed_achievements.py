from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import IntegrityError
from achievements.models import UserClaimedAchievement
from achievements.serializers.client import ClientUserClaimedAchievementSerializer


class ClientListUserClaimedAchievementsView(generics.ListAPIView):
    serializer_class = ClientUserClaimedAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            UserClaimedAchievement.objects.select_related("achievement")
            .filter(user=self.request.user)
            .order_by("-user_claimed_achievement_id")
        )


class ClientClaimAchievementView(generics.CreateAPIView):
    serializer_class = ClientUserClaimedAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        achievement_id = kwargs.get("achievement_id")
        try:
            obj, created = UserClaimedAchievement.objects.get_or_create(
                user=request.user, achievement_id=achievement_id
            )
            serializer = self.get_serializer(obj)
            if created:
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                return Response(serializer.data, status=status.HTTP_200_OK)
        except IntegrityError:
            # Fallback; uniqueness race condition
            obj = UserClaimedAchievement.objects.get(user=request.user, achievement_id=achievement_id)
            serializer = self.get_serializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
