from rest_framework import serializers
from courses.models import UserCourse

class ClientUserCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourse
        fields = [
            "user_course_id",
            "course_id",
            "enrollment_date",
            "is_dropped",
        ]
        read_only_fields = fields
