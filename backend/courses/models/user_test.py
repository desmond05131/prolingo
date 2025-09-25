from django.db import models
from django.conf import settings


class UserTest(models.Model):
    user_test_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_tests")
    test = models.ForeignKey("courses.Test", on_delete=models.CASCADE, related_name="user_tests")
    attempt_date = models.DateTimeField(auto_now_add=True)
    time_spent = models.PositiveIntegerField(help_text="Time spent in seconds", null=True, blank=True)

    class Meta:
        ordering = ["-user_test_id"]
        indexes = [
            models.Index(fields=["user"], name="idx_usertest_user"),
            models.Index(fields=["test"], name="idx_usertest_test"),
        ]

    def __str__(self):
        return f"UserTest<user={self.user_id} test={self.test_id}>"
