from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from common import (
    ENERGY_MAX,
    get_regen_interval_for_user,
    get_xp_boost_multiplier_for_user,
)

class UserGameInfos(models.Model):
    gameinfo_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="gameinfo")

    xp_value = models.PositiveIntegerField(default=0)
    energy_value = models.PositiveIntegerField(default=100)
    energy_last_updated_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "User Game Info"
        verbose_name_plural = "User Game Infos"
        ordering = ["-xp_value", "-energy_value"]

    def add_xp(self, amount: int):
        if amount < 0:
            return 0
        # Apply premium XP boost multiplier
        multiplier = get_xp_boost_multiplier_for_user(self.user)
        boosted = int(round(amount * multiplier))
        self.xp_value += boosted
        self.save(update_fields=["xp_value"])
        return boosted

    def decrement_energy(self, amount: int = 1):
        if amount < 0:
            return
        if self.energy_value > 0:
            self.energy_value = max(0, self.energy_value - amount)
            self.energy_last_updated_date = timezone.now()
            self.save(update_fields=["energy_value", "energy_last_updated_date"])

    def add_energy(self, amount: int):
        """Increase user's energy and update timestamp.

        Negative amounts are ignored. You may clamp to a max later if needed.
        """
        if amount is None or amount <= 0:
            return
        self.apply_passive_energy_regen()
        self.energy_value += amount
        self.energy_last_updated_date = timezone.now()
        self.save(update_fields=["energy_value", "energy_last_updated_date"])

    def reset_energy(self, full: int = 100):
        if self.energy_value < full:
            self.energy_value = full
            self.energy_last_updated_date = timezone.now()
            self.save(update_fields=["energy_value", "energy_last_updated_date"])

    def apply_passive_energy_regen(self):
        """Regenerate energy based on time elapsed since last update.

        - Interval depends on whether the user has active premium.
        - Honors ENERGY_MAX cap if defined (None means no cap).
        - Updates energy_last_updated_date by the exact number of intervals applied,
          preserving any remainder time for future regen ticks.
        """
        now = timezone.now()
        if not self.energy_last_updated_date:
            self.energy_last_updated_date = now
            self.save(update_fields=["energy_last_updated_date"])
            return

        interval: timedelta = get_regen_interval_for_user(self.user)
        if interval <= timedelta(0):
            return

        elapsed = now - self.energy_last_updated_date
        if elapsed < interval:
            return

        # Calculate how many full intervals have passed
        increments = elapsed // interval
        if increments <= 0:
            return

        # If there is a cap, limit increments to the missing amount
        if ENERGY_MAX is not None:
            missing = max(0, ENERGY_MAX - self.energy_value)
            if missing <= 0:
                return
            used_increments = int(min(increments, missing))
        else:
            used_increments = int(increments)

        if used_increments <= 0:
            return

        self.energy_value += used_increments
        # Advance last_updated by the exact time consumed by applied increments
        self.energy_last_updated_date = self.energy_last_updated_date + (interval * used_increments)
        # Clamp to cap if needed
        if ENERGY_MAX is not None and self.energy_value > ENERGY_MAX:
            self.energy_value = ENERGY_MAX
        self.save(update_fields=["energy_value", "energy_last_updated_date"])

    def __str__(self):
        return f"GameInfo<{self.user.username}>"
