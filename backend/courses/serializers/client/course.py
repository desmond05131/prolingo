from rest_framework import serializers
from courses.models import Course

class ClientCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["course_id", "title", "description", "status"]
        read_only_fields = fields
