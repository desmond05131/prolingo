from rest_framework import serializers
from ...models import UserGameInfos
from ...utils import compute_level_from_total_xp, get_level_up_xp

class ClientUserGameInfosSerializer(serializers.ModelSerializer):
    # Derived fields for client display
    level = serializers.SerializerMethodField()
    next_level_xp = serializers.SerializerMethodField()
    next_level_progress_pct = serializers.SerializerMethodField()

    class Meta:
        model = UserGameInfos
        fields = [
            "gameinfo_id",
            "xp_value",
            "energy_value",
            "energy_last_updated_date",
            # computed
            "level",
            "next_level_xp",
            "next_level_progress_pct",
        ]
        read_only_fields = [
            "gameinfo_id",
            "energy_last_updated_date",
            "level",
            "next_level_xp",
            "next_level_progress_pct",
        ]

    def get_level(self, obj: UserGameInfos) -> int:
        return compute_level_from_total_xp(getattr(obj, "xp_value", 0) or 0)

    def get_next_level_xp(self, obj: UserGameInfos) -> int:
        """XP required to advance from the current level to the next.

        This is the segment length for the user's current level, useful as the denominator
        when computing progress to the next level in the client.
        """
        level = self.get_level(obj)
        return get_level_up_xp(level)

    def get_next_level_progress_pct(self, obj: UserGameInfos) -> int:
        """Integer percent [0..100] of progress within the current level.

        Computes XP already earned within this level divided by the XP required to reach the next level.
        """
        total_xp = int(getattr(obj, "xp_value", 0) or 0)
        if total_xp <= 0:
            return 0

        # Derive current level and XP into this level by simulating the progression.
        level = 1
        xp_remaining = total_xp
        while True:
            req = get_level_up_xp(level)
            if xp_remaining < req:
                # xp_remaining is XP into current level
                denom = req
                break
            xp_remaining -= req
            level += 1

        if denom <= 0:
            return 0
        # Clamp to [0, 100]
        pct = int(round((xp_remaining / denom) * 100))
        if pct < 0:
            return 0
        if pct > 100:
            return 100
        return pct
