from django.db import models


class Chapter(models.Model):
    chapter_id = models.AutoField(primary_key=True)
    course = models.ForeignKey("courses.Course", on_delete=models.CASCADE, related_name="chapters")
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    learning_resource_url = models.URLField(null=True, blank=True)
    order_index = models.PositiveIntegerField(help_text="Position within the course")

    class Meta:
        ordering = ["course_id", "order_index", "chapter_id"]
        constraints = [
            models.UniqueConstraint(fields=["course", "order_index"], name="uniq_course_chapter_order"),
        ]
        indexes = [
            models.Index(fields=["course"], name="idx_chapter_course"),
        ]

    def __str__(self):
        return f"Chapter<{self.chapter_id}:{self.title}>"
