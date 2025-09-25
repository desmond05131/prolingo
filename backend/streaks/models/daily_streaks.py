from django.db import models
from django.conf import settings
from django.utils import timezone

class DailyStreak(models.Model):
    daily_streak_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="daily_streaks",
    )
    daily_streak_date = models.DateField(default=timezone.now)
    is_streak_saver = models.BooleanField(default=False, help_text="Whether a streak saver was used for this day")

    class Meta:
        verbose_name = "Daily Streak"
        verbose_name_plural = "Daily Streaks"
        constraints = [
            models.UniqueConstraint(fields=["user", "daily_streak_date"], name="uniq_user_streak_date"),
        ]
        indexes = [
            models.Index(fields=["user", "daily_streak_date"], name="idx_user_date"),
        ]
        ordering = ["-daily_streak_date", "-daily_streak_id"]

    def __str__(self):
        return f"DailyStreak<{self.user_id}:{self.daily_streak_date} saver={self.is_streak_saver}>"
