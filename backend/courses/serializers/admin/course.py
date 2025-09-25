from rest_framework import serializers
from courses.models import Course

class AdminCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "course_id",
            "title",
            "description",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["course_id", "created_at", "updated_at"]
