from django.db import models
from django.conf import settings


class Course(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        ARCHIVED = "archived", "Archived"
        DRAFT = "draft", "Draft"

    course_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="courses_created",
        null=True,
        blank=True,
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="courses_updated",
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["course_id"]
        indexes = [
            models.Index(fields=["status"], name="idx_course_status"),
            models.Index(fields=["created_by"], name="idx_course_created_by"),
            models.Index(fields=["updated_by"], name="idx_course_updated_by"),
        ]

    def __str__(self):
        return f"Course<{self.course_id}:{self.title}>"
