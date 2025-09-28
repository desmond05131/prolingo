from django.conf import settings
from django.db import models
from django.utils import timezone

class Course(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('archived', 'Archived'),
        ('draft', 'Draft'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses_created')
    created_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    def __str__(self):
        return self.title

class Chapter(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)  # lesson text / media links
    order_index = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order_index']

    def __str__(self):
        return f"{self.course.title} — {self.title}"

class Test(models.Model):
    TEST_TYPES = [('quiz','Quiz'), ('coding','Coding'), ('objective','Objective')]
    STRUCTURE_CHOICES = [('objective','objective'), ('no-repeat','no-repeat'), ('custom','custom')]

    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='tests')
    test_type = models.CharField(max_length=20, choices=TEST_TYPES)
    repeatable = models.BooleanField(default=False)
    max_attempts = models.PositiveIntegerField(default=1)
    passing_score = models.FloatField(default=0.0)
    structure = models.CharField(max_length=20, choices=STRUCTURE_CHOICES, default='objective')

    def __str__(self):
        return f"{self.chapter} — {self.test_type}"

class Question(models.Model):
    QUESTION_TYPES = [('mcq','MCQ'), ('short','ShortAnswer'), ('coding','Coding'), ('fill','FillBlank')]
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES)
    points = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"Q{self.id} ({self.question_type})"

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Option {self.id} for Question {self.question_id}"

class UserCourse(models.Model):
    STATUS_CHOICES = [('in-progress','in-progress'), ('completed','completed'), ('dropped','dropped')]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrollment_date = models.DateTimeField(auto_now_add=True)
    progress_percent = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in-progress')

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} in {self.course.title}"

class UserChapter(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_chapters')
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='user_progress')
    completed = models.BooleanField(default=False)
    last_accessed = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'chapter')

    def __str__(self):
        return f"{self.user.username} - {self.chapter}"

class UserTestResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='test_results')
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='results')
    score = models.FloatField()
    attempt_number = models.PositiveIntegerField(default=1)
    attempt_date = models.DateTimeField(auto_now_add=True)
    passed = models.BooleanField(default=False)

    def __str__(self):
        return f"Result {self.id} - {self.user.username} - {self.test}"

class UserAnswer(models.Model):
    result = models.ForeignKey(UserTestResult, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    given_answer = models.TextField(blank=True, null=True)  # text, option id, or code snippet
    is_correct = models.BooleanField(default=False)
    time_spent = models.PositiveIntegerField(default=0)  # seconds

    def __str__(self):
        return f"Answer {self.id} for result {self.result_id}"