from rest_framework import serializers
from .models import Course, Chapter, Test, Question, Option, UserTestResult


class CourseSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Course
        fields = ("course_id", "course_name", "description", "created_by", "created_date")
        read_only_fields = ("course_id", "created_by", "created_date")


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ("chapter_id", "course", "chapter_title", "chapter_order")
        read_only_fields = ("chapter_id",)


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ("test_id", "chapter", "test_type", "is_repeatable", "structure")
        read_only_fields = ("test_id",)


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ("option_id", "question", "option_text", "is_correct")
        read_only_fields = ("option_id",)


class QuestionSerializer(serializers.ModelSerializer):
    # Optionally expose options in read responses (nested read-only)
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ("question_id", "test", "question_text", "question_type", "options")
        read_only_fields = ("question_id",)


class UserTestResultSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = UserTestResult
        fields = ("result_id", "user", "test", "score", "attempt_date")
        read_only_fields = ("result_id", "user", "attempt_date")