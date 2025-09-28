from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class PremiumSubscription(models.Model):
    class SubscriptionType(models.TextChoices):
        MONTH = "month", "Monthly"
        YEAR = "year", "Yearly"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending Payment"
        ACTIVE = "active", "Active"
        EXPIRED = "expired", "Expired"

    subscription_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="premium_subscriptions",
    )
    type = models.CharField(max_length=10, choices=SubscriptionType.choices)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    is_renewable = models.BooleanField(default=True)
    amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        indexes = [
            models.Index(fields=["user"], name="idx_premium_user"),
            models.Index(fields=["type"], name="idx_premium_type"),
            models.Index(fields=["status"], name="idx_premium_status"),
        ]
        verbose_name = "Premium Subscription"
        verbose_name_plural = "Premium Subscriptions"

    def save(self, *args, **kwargs):
        # Auto-populate end_date if absent based on subscription type
        if not self.end_date:
            if self.type == self.SubscriptionType.YEAR:
                self.end_date = self.start_date + timedelta(days=365)
            else:
                self.end_date = self.start_date + timedelta(days=30)

        # Derive status if currently pending or active and time window changed
        now = timezone.now()
        if self.status != self.Status.PENDING:
            if self.end_date and now > self.end_date:
                self.status = self.Status.EXPIRED
            elif self.start_date <= now <= self.end_date and self.status != self.Status.EXPIRED:
                # Only set to active if not already expired
                self.status = self.Status.ACTIVE if self.status != self.Status.ACTIVE else self.status
        super().save(*args, **kwargs)

    @property
    def is_active(self):
        now = timezone.now()
        return self.status == self.Status.ACTIVE and self.start_date <= now <= (self.end_date or now)

    def __str__(self):
        return f"PremiumSubscription<{self.subscription_id}> user={self.user_id} {self.type} status={self.status} renewable={self.is_renewable}"
