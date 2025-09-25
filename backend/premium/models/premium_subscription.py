from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class PremiumSubscription(models.Model):
    class SubscriptionType(models.TextChoices):
        MONTH = "month", "Monthly"
        YEAR = "year", "Yearly"

    class Tier(models.IntegerChoices):
        TIER1 = 1, "Tier 1"
        TIER2 = 2, "Tier 2"
        TIER3 = 3, "Tier 3"

    subscription_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="premium_subscriptions",
    )
    type = models.CharField(max_length=10, choices=SubscriptionType.choices)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    tier = models.PositiveSmallIntegerField(choices=Tier.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-subscription_id"]
        indexes = [
            models.Index(fields=["user"], name="idx_premium_user"),
            models.Index(fields=["type"], name="idx_premium_type"),
            models.Index(fields=["tier"], name="idx_premium_tier"),
        ]
        verbose_name = "Premium Subscription"
        verbose_name_plural = "Premium Subscriptions"

    def save(self, *args, **kwargs):
        if not self.end_date:
            if self.type == self.SubscriptionType.YEAR:
                self.end_date = self.start_date + timedelta(days=365)
            else:
                self.end_date = self.start_date + timedelta(days=30)
        super().save(*args, **kwargs)

    @property
    def is_active(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date

    def __str__(self):
        return f"PremiumSubscription<{self.subscription_id}> user={self.user_id} {self.type} tier={self.tier}"
