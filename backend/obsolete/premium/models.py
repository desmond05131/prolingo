from django.conf import settings
from django.db import models
from django.utils import timezone
from datetime import timedelta

User = settings.AUTH_USER_MODEL

class PremiumSubscription(models.Model):
    PLAN_MONTHLY = 'monthly'
    PLAN_YEARLY = 'yearly'
    PLAN_CHOICES = [
        (PLAN_MONTHLY, 'Monthly'),
        (PLAN_YEARLY, 'Yearly'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan_type = models.CharField(max_length=10, choices=PLAN_CHOICES)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()

    def save(self, *args, **kwargs):
        # If end_date not provided, compute based on plan_type
        if not self.end_date:
            if self.plan_type == self.PLAN_YEARLY:
                self.end_date = self.start_date + timedelta(days=365)
            else:
                self.end_date = self.start_date + timedelta(days=30)
        super().save(*args, **kwargs)

    def is_active(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date

    def __str__(self):
        return f"{self.user} - {self.plan_type} ({self.start_date.date()} → {self.end_date.date()})"


class PremiumFeature(models.Model):
    FEATURE_TYPES = [
        ('energy_boost', 'Energy Boost'),
        ('streak_protection', 'Streak Protection'),
        ('profile_customization', 'Profile Customization'),
        ('premium_course_access', 'Premium Course Access'),
    ]

    subscription = models.ForeignKey(PremiumSubscription, on_delete=models.CASCADE, related_name='features')
    feature_type = models.CharField(max_length=50, choices=FEATURE_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"{self.subscription.user} - {self.feature_type}"