from django.db import models


class Test(models.Model):
    test_id = models.AutoField(primary_key=True)
    chapter = models.ForeignKey("courses.Chapter", on_delete=models.CASCADE, related_name="tests")
    passing_score = models.PositiveIntegerField(null=True, blank=True)
    order_index = models.PositiveIntegerField()
    title = models.CharField(max_length=255, help_text="Display title for the test")

    class Meta:
        ordering = ["chapter_id", "order_index", "test_id"]
        constraints = [
            models.UniqueConstraint(fields=["chapter", "order_index"], name="uniq_chapter_test_order"),
        ]
        indexes = [
            models.Index(fields=["chapter"], name="idx_test_chapter"),
        ]

    def __str__(self):
        return f"Test<{self.test_id} ch={self.chapter_id} title='{self.title}'>"
