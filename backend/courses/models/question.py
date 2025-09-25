from django.db import models


class Question(models.Model):
    class Type(models.TextChoices):
        MCQ = "mcq", "Multiple Choice"
        FILL_IN = "fill_in_blank", "Fill In Blank"

    question_id = models.AutoField(primary_key=True)
    test = models.ForeignKey("courses.Test", on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    type = models.CharField(max_length=20, choices=Type.choices)
    correct_answer_text = models.TextField(help_text="Used for MCQ (the correct choice text) or fill in answer")
    order_index = models.PositiveIntegerField()

    class Meta:
        ordering = ["test_id", "order_index", "question_id"]
        constraints = [
            models.UniqueConstraint(fields=["test", "order_index"], name="uniq_test_question_order"),
        ]
        indexes = [
            models.Index(fields=["test"], name="idx_question_test"),
        ]

    def __str__(self):
        return f"Question<{self.question_id} test={self.test_id}>"
