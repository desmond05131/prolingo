from django.db import models
from django.conf import settings
from django.utils import timezone

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
            return
        self.xp_value += amount
        self.save(update_fields=["xp_value"])

    def decrement_energy(self, amount: int = 1):
        if amount < 0:
            return
        if self.energy_value > 0:
            self.energy_value = max(0, self.energy_value - amount)
            self.energy_last_updated_date = timezone.now()
            self.save(update_fields=["energy_value", "energy_last_updated_date"])

    def reset_energy(self, full: int = 100):
        if self.energy_value < full:
            self.energy_value = full
            self.energy_last_updated_date = timezone.now()
            self.save(update_fields=["energy_value", "energy_last_updated_date"])

    def __str__(self):
        return f"GameInfo<{self.user.username}>"
