from django.db import models


class UserTestAnswer(models.Model):
    user_test_answer_id = models.AutoField(primary_key=True)
    user_test = models.ForeignKey("courses.UserTest", on_delete=models.CASCADE, related_name="answers")
    given_answer_text = models.TextField()
    is_correct = models.BooleanField()

    class Meta:
        ordering = ["-user_test_answer_id"]
        indexes = [
            models.Index(fields=["user_test"], name="idx_user_test_answer_test"),
            models.Index(fields=["is_correct"], name="idx_user_test_answer_correct"),
        ]

    def __str__(self):
        return f"UserTestAnswer<{self.user_test_answer_id} test={self.user_test_id}>"
