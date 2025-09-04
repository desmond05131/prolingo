from django.db import models
from django.conf import settings
from django.utils import timezone


class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="courses"
    )
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_date"]

    def __str__(self):
        return self.course_name


class Chapter(models.Model):
    chapter_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="chapters")
    chapter_title = models.CharField(max_length=255)
    chapter_order = models.PositiveIntegerField()

    class Meta:
        ordering = ["chapter_order"]
        unique_together = ("course", "chapter_order")

    def __str__(self):
        return f"{self.course.course_name} - {self.chapter_title}"


class Test(models.Model):
    TEST_TYPE_CHOICES = [
        ("quiz", "Quiz"),
        ("coding", "Coding"),
        ("objective", "Objective"),
    ]
    STRUCTURE_CHOICES = [
        ("objective", "Objective"),
        ("no-repeat", "No repeat"),
        ("custom", "Custom"),
    ]

    test_id = models.AutoField(primary_key=True)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name="tests")
    test_type = models.CharField(max_length=20, choices=TEST_TYPE_CHOICES)
    is_repeatable = models.BooleanField(default=False)
    structure = models.CharField(max_length=20, choices=STRUCTURE_CHOICES, default="objective")

    class Meta:
        ordering = ["test_id"]

    def __str__(self):
        return f"{self.chapter.chapter_title} - {self.test_type}"


class Question(models.Model):
    QUESTION_TYPE_CHOICES = [
        ("mcq", "Multiple Choice"),
        ("short", "Short Answer"),
        ("coding", "Coding"),
    ]

    question_id = models.AutoField(primary_key=True)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES)

    class Meta:
        ordering = ["question_id"]

    def __str__(self):
        return f"Q{self.pk} ({self.question_type})"


class Option(models.Model):
    option_id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    option_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)

    class Meta:
        ordering = ["option_id"]

    def __str__(self):
        return f"Option {self.pk} for Q{self.question_id}"


class UserTestResult(models.Model):
    result_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="test_results")
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="results")
    score = models.DecimalField(max_digits=6, decimal_places=2)
    attempt_date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-attempt_date"]

    def __str__(self):
        return f"{self.user} - {self.test_id} - {self.score}"