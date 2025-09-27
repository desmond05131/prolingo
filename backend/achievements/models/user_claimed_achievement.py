from django.db import models
from django.conf import settings


class UserClaimedAchievement(models.Model):
    """Represents an achievement the user has claimed.

    A user can only claim a specific achievement once.
    """

    user_claimed_achievement_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="claimed_achievements",
    )
    achievement = models.ForeignKey(
        "achievements.Achievement",
        on_delete=models.CASCADE,
        related_name="user_claims",
    )
    claimed_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "User Claimed Achievement"
        verbose_name_plural = "User Claimed Achievements"
        ordering = ["-user_claimed_achievement_id"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "achievement"], name="uniq_user_achievement_claim"
            )
        ]
        indexes = [
            models.Index(fields=["user"], name="idx_user_claim_user"),
            models.Index(fields=["achievement"], name="idx_user_claim_ach"),
        ]

    def __str__(self):
        return f"UserClaimedAchievement<user={self.user_id}, achievement={self.achievement_id}>"
