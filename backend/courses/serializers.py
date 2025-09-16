from rest_framework import serializers
from .models import (
    Course, Chapter, Test, Question, Option,
    UserCourse, UserChapter, UserTestResult, UserAnswer
)
from users.serializers import UserSerializer  # reuse if available
from django.conf import settings

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'question', 'option_text', 'is_correct']
        read_only_fields = ['id']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'test', 'question_text', 'question_type', 'points', 'options']

class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Test
        fields = ['id', 'chapter', 'test_type', 'repeatable', 'max_attempts', 'passing_score', 'structure', 'questions']

class ChapterSerializer(serializers.ModelSerializer):
    tests = TestSerializer(many=True, read_only=True)
    class Meta:
        model = Chapter
        fields = ['id', 'course', 'title', 'content', 'order_index', 'tests']

class CourseSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)
    created_by_username = serializers.ReadOnlyField(source='created_by.username')
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'created_by', 'created_by_username', 'created_date', 'status', 'chapters']
        read_only_fields = ['created_by', 'created_date', 'created_by_username']

class UserCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourse
        fields = ['id', 'course', 'enrollment_date', 'progress_percent', 'status']
        read_only_fields = ['enrollment_date', 'progress_percent']
        
    def validate_course(self, value):
        # Ensure the course exists and is active
        if value.status != 'active':
            raise serializers.ValidationError("Cannot enroll in inactive courses.")
        return value

class UserChapterSerializer(serializers.ModelSerializer):
    chapter_title = serializers.ReadOnlyField(source='chapter.title')
    class Meta:
        model = UserChapter
        fields = ['id', 'user', 'chapter', 'chapter_title', 'completed', 'last_accessed']

class UserTestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTestResult
        fields = ['id', 'user', 'test', 'score', 'attempt_number', 'attempt_date', 'passed']

class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = ['id', 'result', 'question', 'given_answer', 'is_correct', 'time_spent']