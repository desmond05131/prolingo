from django.db import models


class QuestionChoice(models.Model):
    choice_id = models.AutoField(primary_key=True)
    question = models.ForeignKey("courses.Question", on_delete=models.CASCADE, related_name="choices")
    text = models.CharField(max_length=255)
    order_index = models.PositiveIntegerField()

    class Meta:
        ordering = ["question_id", "order_index", "choice_id"]
        constraints = [
            models.UniqueConstraint(fields=["question", "order_index"], name="uniq_question_choice_order"),
        ]
        indexes = [
            models.Index(fields=["question"], name="idx_choice_question"),
        ]

    def __str__(self):
        return f"QuestionChoice<{self.choice_id} q={self.question_id}>"
