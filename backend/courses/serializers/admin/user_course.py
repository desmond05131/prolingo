from rest_framework import serializers
from courses.models import UserCourse

class AdminUserCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourse
        fields = [
            "user_course_id",
            "user",
            "course",
            "enrollment_date",
            "is_dropped",
        ]
        read_only_fields = ["user_course_id", "enrollment_date"]
