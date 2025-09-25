from django.db import models
from django.conf import settings


class UserCourse(models.Model):
    user_course_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_courses")
    course = models.ForeignKey("courses.Course", on_delete=models.CASCADE, related_name="enrollments")
    enrollment_date = models.DateTimeField(auto_now_add=True)
    is_dropped = models.BooleanField(default=False)

    class Meta:
        ordering = ["-user_course_id"]
        constraints = [
            models.UniqueConstraint(fields=["user", "course"], name="uniq_user_course_enrollment"),
        ]
        indexes = [
            models.Index(fields=["user"], name="idx_usercourse_user"),
            models.Index(fields=["course"], name="idx_usercourse_course"),
            models.Index(fields=["is_dropped"], name="idx_usercourse_is_dropped"),
        ]

    def __str__(self):
        return f"UserCourse<user={self.user_id} course={self.course_id} dropped={self.is_dropped}>"
