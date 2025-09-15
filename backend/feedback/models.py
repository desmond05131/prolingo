from django.conf import settings
from django.db import models
from django.utils import timezone

User = settings.AUTH_USER_MODEL

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="feedbacks")
    message = models.TextField()
    submitted_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback {self.pk} by {self.user}"

    class Meta:
        ordering = ["-submitted_date"]

class AdminFeedbackResponse(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name="responses")
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="admin_responses")
    response_text = models.TextField()
    response_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response {self.pk} to Feedback {self.feedback_id}"

    class Meta:
        ordering = ["-response_date"]

class AdminAction(models.Model):
    ACTION_CHOICES = [
        ("add_user", "add_user"),
        ("delete_user", "delete_user"),
        ("edit_course", "edit_course"),
        ("other", "other"),
    ]
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="admin_actions")
    action_type = models.CharField(max_length=50, choices=ACTION_CHOICES, default="other")
    target_id = models.CharField(max_length=255, blank=True, null=True)  # store related id or descriptor
    action_date = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True, default="")  # optional extra info

    def __str__(self):
        return f"Action {self.action_type} by {self.admin} at {self.action_date}"