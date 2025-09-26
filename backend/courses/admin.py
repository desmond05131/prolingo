from django.contrib import admin
from .models import (
    Course,
    Chapter,
    Test,
    Question,
    QuestionChoice,
    UserCourse,
    UserTest,
    UserTestAnswer,
)


class QuestionChoiceInline(admin.TabularInline):
    model = QuestionChoice
    extra = 0


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0


class TestInline(admin.TabularInline):
    model = Test
    extra = 0


class ChapterInline(admin.TabularInline):
    model = Chapter
    extra = 0


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "course_id",
        "title",
        "status",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("title", "course_id")
    autocomplete_fields = ("created_by", "updated_by")
    inlines = [ChapterInline]
    ordering = ("course_id",)


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = (
        "chapter_id",
        "course",
        "title",
        "order_index",
    )
    list_filter = ("course",)
    search_fields = ("title", "chapter_id", "course__title")
    inlines = [TestInline]
    ordering = ("course_id", "order_index")


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = (
        "test_id",
        "chapter",
        "title",
        "passing_score",
        "order_index",
    )
    list_filter = ("chapter",)
    search_fields = ("title", "test_id", "chapter__title")
    inlines = [QuestionInline]
    ordering = ("chapter_id", "order_index")


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = (
        "question_id",
        "test",
        "type",
        "order_index",
    )
    list_filter = ("type", "test")
    search_fields = ("question_id", "test__title", "text")
    inlines = [QuestionChoiceInline]
    ordering = ("test_id", "order_index")


@admin.register(QuestionChoice)
class QuestionChoiceAdmin(admin.ModelAdmin):
    list_display = (
        "choice_id",
        "question",
        "order_index",
    )
    search_fields = ("choice_id", "question__text", "text")
    list_filter = ("question",)
    ordering = ("question_id", "order_index")


@admin.register(UserCourse)
class UserCourseAdmin(admin.ModelAdmin):
    list_display = (
        "user_course_id",
        "user",
        "course",
        "enrollment_date",
        "is_dropped",
    )
    list_filter = ("is_dropped", "course")
    search_fields = (
        "user__username",
        "course__title",
        "user_course_id",
    )
    autocomplete_fields = ("user", "course")
    ordering = ("-user_course_id",)


@admin.register(UserTest)
class UserTestAdmin(admin.ModelAdmin):
    list_display = (
        "user_test_id",
        "user",
        "test",
        "attempt_date",
        "time_spent",
    )
    list_filter = ("test", "attempt_date")
    search_fields = ("user__username", "test__title", "user_test_id")
    autocomplete_fields = ("user", "test")
    ordering = ("-user_test_id",)


@admin.register(UserTestAnswer)
class UserTestAnswerAdmin(admin.ModelAdmin):
    list_display = (
        "user_test_answer_id",
        "user_test",
        "is_correct",
    )
    list_filter = ("is_correct", "user_test")
    search_fields = ("user_test_answer_id", "user_test__test__title")
    autocomplete_fields = ("user_test",)
    ordering = ("-user_test_answer_id",)
