from typing import List
from rest_framework import generics, permissions, response
from gameinfo.models import UserGameInfos
from gameinfo.serializers.client.leaderboard import (
    LeaderboardEntrySerializer,
    CurrentUserRankSerializer,
)
from gameinfo.utils import compute_level_from_total_xp
from django.db.models import Q


class Top50LeaderboardView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Order by xp desc then energy desc (as per model Meta.ordering)
        qs = (
            UserGameInfos.objects.select_related("user")
            .order_by("-xp_value", "-energy_value", "gameinfo_id")[:50]
        )

        data: List[dict] = []
        for idx, gi in enumerate(qs, start=1):
            data.append(
                {
                    "rank": idx,
                    "user_id": gi.user_id,
                    "username": getattr(gi.user, "username", ""),
                    "xp_value": gi.xp_value,
                    "level": compute_level_from_total_xp(gi.xp_value),
                    "profile_icon": getattr(gi.user, "profile_icon", None),
                }
            )

        ser = LeaderboardEntrySerializer(data=data, many=True)
        ser.is_valid(raise_exception=True)
        return response.Response(ser.data)


class MyLeaderboardRankView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        gi, _ = UserGameInfos.objects.select_related("user").get_or_create(user=request.user)

        # Try to find the user's position within the Top 50 ranking
        top50_user_ids = list(
            UserGameInfos.objects.order_by("-xp_value", "-energy_value", "gameinfo_id")
            .values_list("user_id", flat=True)
        )

        rank = top50_user_ids.index(request.user.id) + 1        

        payload = CurrentUserRankSerializer.from_gameinfo_with_rank(gi, rank)
        # print(payload)
        ser = CurrentUserRankSerializer(data=payload)
        ser.is_valid(raise_exception=True)
        return response.Response(ser.data)
