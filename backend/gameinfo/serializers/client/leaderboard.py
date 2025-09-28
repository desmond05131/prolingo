from rest_framework import serializers
from ...models import UserGameInfos
from ...utils import compute_level_from_total_xp


class LeaderboardEntrySerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    xp_value = serializers.IntegerField()
    level = serializers.IntegerField()
    profile_icon = serializers.CharField(allow_blank=True, allow_null=True, required=False)


class CurrentUserRankSerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    xp_value = serializers.IntegerField()
    level = serializers.IntegerField()
    profile_icon = serializers.CharField(allow_blank=True, allow_null=True, required=False)

    @staticmethod
    def from_gameinfo_with_rank(gameinfo: UserGameInfos, rank: int) -> dict:
        return {
            "rank": rank,
            "user_id": gameinfo.user_id,
            "username": getattr(gameinfo.user, "username", ""),
            "xp_value": gameinfo.xp_value,
            "level": compute_level_from_total_xp(gameinfo.xp_value),
            "profile_icon": getattr(gameinfo.user, "profile_icon", None),
        }
