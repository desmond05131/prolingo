from django.contrib import admin

from .models import Course, Chapter, Test, Question, Option, UserTestResult


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("course_id", "course_name", "created_by", "created_date")
    search_fields = ("course_name", "description", "created_by__username")
    list_filter = ("created_by",)
    autocomplete_fields = ("created_by",)


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ("chapter_id", "course", "chapter_title", "chapter_order")
    list_filter = ("course",)
    search_fields = ("chapter_title",)
    autocomplete_fields = ("course",)


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ("test_id", "chapter", "test_type", "structure", "is_repeatable")
    list_filter = ("test_type", "structure", "is_repeatable", "chapter")
    search_fields = ("=test_id", "chapter__chapter_title")
    autocomplete_fields = ("chapter",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("question_id", "test", "question_type")
    list_filter = ("question_type", "test")
    search_fields = ("question_text",)
    autocomplete_fields = ("test",)


@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ("option_id", "question", "is_correct")
    list_filter = ("is_correct", "question")
    search_fields = ("option_text",)
    autocomplete_fields = ("question",)


@admin.register(UserTestResult)
class UserTestResultAdmin(admin.ModelAdmin):
    list_display = ("result_id", "user", "test", "score", "attempt_date")
    list_filter = ("test", "user")
    autocomplete_fields = ("user", "test")