from django.conf import settings
from django.db import models
from django.utils import timezone

class Leaderboard(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="leaderboard"
    )
    streak_count = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)
    points = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"{self.user.username} - Level {self.level}, Points {self.points}"
    
    class Meta:
        ordering = ['-points', '-level', '-streak_count']

class Levels(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="level_progress"
    )
    current_level = models.PositiveIntegerField(default=1)
    rewards_earned = models.TextField(default="", blank=True)  # JSON string for rewards list
    
    def __str__(self):
        return f"{self.user.username} - Level {self.current_level}"
    
    class Meta:
        verbose_name_plural = "Levels"

class DailyStreaks(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="daily_streak"
    )
    streak_date = models.DateField(default=timezone.now)
    streak_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"{self.user.username} - Streak {self.streak_count}"
    
    class Meta:
        verbose_name_plural = "Daily Streaks"

class Energy(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="energy"
    )
    current_energy = models.PositiveIntegerField(default=100)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - Energy {self.current_energy}"
    
    class Meta:
        verbose_name_plural = "Energy"

class Rewards(models.Model):
    REWARD_TYPES = [
        ('badge', 'Badge'),
        ('points', 'Points'),
        ('bonus', 'Bonus'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="rewards"
    )
    reward_type = models.CharField(max_length=10, choices=REWARD_TYPES)
    earned_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.reward_type} ({self.earned_date})"
    
    class Meta:
        verbose_name_plural = "Rewards"
        ordering = ['-earned_date']