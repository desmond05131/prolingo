from rest_framework import serializers
from courses.models import UserCourse

class ClientUserCourseSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()
    course_description = serializers.SerializerMethodField()

    def get_course_title(self, obj):
        course = getattr(obj, "course", None)
        return getattr(course, "title", None)

    def get_course_description(self, obj):
        course = getattr(obj, "course", None)
        return getattr(course, "description", None)

    class Meta:
        model = UserCourse
        fields = [
            "user_course_id",
            "course_id",
            "course_title",
            "course_description",
            "enrollment_date",
            "is_dropped",
        ]
        read_only_fields = fields
