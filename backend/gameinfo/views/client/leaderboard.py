from typing import List
from rest_framework import generics, permissions, response
from gameinfo.models import UserGameInfos
from gameinfo.serializers.client.leaderboard import (
    LeaderboardEntrySerializer,
    CurrentUserRankSerializer,
)
from gameinfo.utils import compute_level_from_total_xp


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
                }
            )

        ser = LeaderboardEntrySerializer(data=data, many=True)
        ser.is_valid(raise_exception=True)
        return response.Response(ser.data)


class MyLeaderboardRankView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        gi, _ = UserGameInfos.objects.select_related("user").get_or_create(user=request.user)

        # Compute rank efficiently: count records with strictly higher xp, then tie-breakers
        # Rank is 1 + number of users strictly ahead by ordering tuple (-xp, -energy, id)
        ahead_count = UserGameInfos.objects.filter(
            # Higher XP first
            xp_value__gt=gi.xp_value
        ).count()

        # For equal XP, those with higher energy come first
        ahead_ties_energy = UserGameInfos.objects.filter(
            xp_value=gi.xp_value,
            energy_value__gt=gi.energy_value,
        ).count()

        # For exact XP and energy, smaller gameinfo_id should come first? Our ordering is by id ascending after energy desc.
        # Since we order by -xp, -energy, id (ascending), any rows with same xp and energy and smaller id are ahead.
        ahead_ties_id = UserGameInfos.objects.filter(
            xp_value=gi.xp_value,
            energy_value=gi.energy_value,
            gameinfo_id__lt=gi.gameinfo_id,
        ).count()

        rank = 1 + ahead_count + ahead_ties_energy + ahead_ties_id

        payload = CurrentUserRankSerializer.from_gameinfo_with_rank(gi, rank)
        ser = CurrentUserRankSerializer(data=payload)
        ser.is_valid(raise_exception=True)
        return response.Response(ser.data)
