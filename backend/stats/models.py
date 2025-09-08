from django.db import models
from django.conf import settings
from django.utils import timezone

def get_level_up_xp(level):
    return level*50 + 50

class Stats(models.Model):
    stats_id = models.AutoField(primary_key=True)

    level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)

    streak = models.IntegerField(default=0)
    streak_update_date = models.DateTimeField(auto_now_add=True)

    energy = models.IntegerField(default=100)
    last_energy_updated = models.DateTimeField(auto_now_add=True)

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='stats')

    def add_xp(self, amount):
        self.xp += amount
        levelup_required_xp = get_level_up_xp(self.level)

        # for safety purpose, we will limit the max iterations
        MAX_ITER = 127
        iter = 1

        while self.xp >= levelup_required_xp and iter < MAX_ITER:
            iter += 1

            self.xp -= levelup_required_xp
            self.level += 1
            levelup_required_xp = get_level_up_xp(self.level)

        self.save()

    def check_streak(self):
        today = timezone.now().date()
        streak_update_date = self.streak_update_date.date()

        days_elapsed = today.day - streak_update_date.day

        print("streak days elapsed =", days_elapsed)

        if days_elapsed >= 1:
            self.streak = 0
            self.save()

    def decrement_energy(self):
        if self.energy >= 1:
            self.energy -= 1
            self.save()

    def reset_energy(self):
        print("energy =", self.energy)
        if self.energy < 100:
            self.energy = 100
            self.save()

    def __str__(self):
        return self.user.username
