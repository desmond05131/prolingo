from rest_framework import serializers
from courses.models import UserCourse

class AdminUserCourseSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)
    class Meta:
        model = UserCourse
        fields = [
            "user_course_id",
            "user",
            "course",
            "enrollment_date",
            "is_dropped",
            "username",
            "course_title",
        ]
        read_only_fields = ["user_course_id", "enrollment_date"]
