from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import IntegrityError
from achievements.models import UserClaimedAchievement
from achievements.models import Achievement
from gameinfo.models import UserGameInfos
from django.db import transaction
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
            try:
                achievement = Achievement.objects.get(pk=achievement_id)
            except Achievement.DoesNotExist:
                return Response({"detail": "Achievement not found"}, status=status.HTTP_404_NOT_FOUND)

            with transaction.atomic():
                obj, created = UserClaimedAchievement.objects.get_or_create(
                    user=request.user, achievement=achievement
                )

                # Apply reward only on first successful claim
                if created:
                    # Ensure gameinfo exists
                    gameinfo, _ = UserGameInfos.objects.get_or_create(user=request.user)
                    if achievement.reward_type == Achievement.RewardType.XP:
                        amount = achievement.reward_amount or 0
                        if amount > 0:
                            gameinfo.add_xp(amount)
                    elif achievement.reward_type == Achievement.RewardType.ENERGY:
                        amount = achievement.reward_amount or 0
                        if amount > 0:
                            gameinfo.add_energy(amount)
                    else:
                        # Badge or any other type: no-op
                        pass

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
