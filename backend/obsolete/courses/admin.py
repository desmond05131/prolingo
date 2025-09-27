from django.contrib import admin
from .models import Course, Chapter, Test, Question, Option, UserCourse, UserChapter, UserTestResult, UserAnswer

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'created_date', 'status')
    search_fields = ('title', 'description', 'created_by__username')
    list_filter = ('status', 'created_date')

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order_index')
    list_filter = ('course',)
    ordering = ('course', 'order_index')

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('id', 'chapter', 'test_type', 'repeatable', 'max_attempts', 'passing_score')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'test', 'question_type', 'points')
    search_fields = ('question_text',)

@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'option_text', 'is_correct')

@admin.register(UserCourse)
class UserCourseAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'progress_percent', 'status')

@admin.register(UserChapter)
class UserChapterAdmin(admin.ModelAdmin):
    list_display = ('user', 'chapter', 'completed', 'last_accessed')

@admin.register(UserTestResult)
class UserTestResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'test', 'score', 'attempt_number', 'attempt_date', 'passed')

@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ('result', 'question', 'is_correct', 'time_spent')