from rest_framework import serializers
from django.utils import timezone
import math
from common import ENERGY_MAX, get_regen_interval_for_user
from ...models import UserGameInfos
from ...utils import compute_level_from_total_xp, get_level_up_xp

class ClientUserGameInfosSerializer(serializers.ModelSerializer):
    # Derived fields for client display
    level = serializers.SerializerMethodField()
    next_level_xp = serializers.SerializerMethodField()
    next_level_progress_pct = serializers.SerializerMethodField()
    time_to_max_energy_seconds = serializers.SerializerMethodField()

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
            "time_to_max_energy_seconds",
        ]
        read_only_fields = [
            "gameinfo_id",
            "energy_last_updated_date",
            "level",
            "next_level_xp",
            "next_level_progress_pct",
            "time_to_max_energy_seconds",
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

    def get_time_to_max_energy_seconds(self, obj: UserGameInfos) -> int:
        """Seconds remaining until the user's energy reaches the cap (ENERGY_MAX).

        - Uses the per-user regeneration interval (premium-aware).
        - Respects the last updated timestamp to account for partial progress to the next tick.
        - Returns 0 if already at or above the cap.
        """
        # If there's no cap configured, treat as already full from a client's perspective
        if ENERGY_MAX is None:
            return 0

        current_energy = int(getattr(obj, "energy_value", 0) or 0)
        missing = ENERGY_MAX - current_energy
        if missing <= 0:
            return 0

        interval = get_regen_interval_for_user(obj.user)
        # Guard against misconfiguration
        total_interval_seconds = max(0.0, interval.total_seconds())
        if total_interval_seconds <= 0.0:
            # No regeneration possible
            return 0

        last_updated = getattr(obj, "energy_last_updated_date", None) or timezone.now()
        now = timezone.now()
        elapsed = now - last_updated

        # Time remaining to the next regen tick. If elapsed >= interval (e.g., if
        # passive regen wasn't applied yet), modulo handles partial alignment.
        remainder = elapsed % interval if elapsed.total_seconds() > 0 else elapsed
        to_next_tick = interval - remainder if remainder < interval else interval

        # Total time = time to next tick + (missing - 1) full intervals
        total_seconds = to_next_tick.total_seconds() + max(0, missing - 1) * total_interval_seconds
        # Ceil to whole seconds so clients can down-count cleanly
        return int(max(0, math.ceil(total_seconds)))
