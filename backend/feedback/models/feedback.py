from django.db import models
from django.conf import settings


class Feedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    message = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="feedback_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="feedback_updated",
        null=True,
        blank=True,
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        indexes = [
            models.Index(fields=["created_by"], name="idx_feedback_created_by"),
            models.Index(fields=["updated_by"], name="idx_feedback_updated_by"),
        ]
        verbose_name = "Feedback"
        verbose_name_plural = "Feedback"

    def __str__(self):
        return f"Feedback<{self.feedback_id}> by {self.created_by_id}"
