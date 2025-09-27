from django.db import models

# Placeholder for future relation to a completed test result object.
# The existing obsolete.courses.UserTestResult is not active; when a production
# test result model exists, update this FK accordingly.

class Achievement(models.Model):
    class RewardType(models.TextChoices):
        XP = "xp", "XP"
        ENERGY = "energy", "Energy"
        BADGE = "badge", "Badge"

    achievement_id = models.AutoField(primary_key=True)

    # Target criteria (all nullable; at least one should be set in admin UI)
    target_xp_value = models.PositiveIntegerField(null=True, blank=True)
    target_streak_value = models.PositiveIntegerField(null=True, blank=True)
    # Placeholder FK: using IntegerField until proper model exists.
    target_completed_test_id = models.IntegerField(null=True, blank=True, help_text="FK to completed test result (update to ForeignKey when model available)")

    # Reward definition
    reward_type = models.CharField(max_length=20, choices=RewardType.choices)
    reward_amount = models.PositiveIntegerField(null=True, blank=True, help_text="Used for xp or energy rewards")
    reward_content = models.CharField(max_length=255, null=True, blank=True, help_text="Used for badge reward (e.g., badge code or image ref)")
    reward_content_description = models.CharField(max_length=512, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Achievement"
        verbose_name_plural = "Achievements"
        ordering = ["-achievement_id"]
        indexes = [
            models.Index(fields=["reward_type"], name="idx_ach_reward_type"),
        ]

    def __str__(self):
        return f"Achievement<{self.achievement_id}:{self.reward_type}>"

    def clean(self):
        from django.core.exceptions import ValidationError
        # Ensure at least one target criterion is provided
        if not any([
            self.target_xp_value is not None,
            self.target_streak_value is not None,
            self.target_completed_test_id is not None,
        ]):
            raise ValidationError("At least one target criterion must be set")
        # For badge reward, content must be present
        if self.reward_type == self.RewardType.BADGE and not self.reward_content:
            raise ValidationError("reward_content is required for badge rewards")
        # For xp/energy rewards, reward_amount must be provided
        if self.reward_type in {self.RewardType.XP, self.RewardType.ENERGY} and self.reward_amount is None:
            raise ValidationError("reward_amount is required for xp or energy rewards")
