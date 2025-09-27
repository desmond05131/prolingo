from rest_framework import serializers
from courses.models import Test
from courses.serializers.admin.course import AdminCourseSerializer
from courses.serializers.admin.chapter import AdminChapterSerializer


class AdminTestSlimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = [
            "test_id",
            "passing_score",
            "order_index",
            "title",
        ]
        read_only_fields = fields


class AdminTestsFlatItemSerializer(serializers.Serializer):
    course = AdminCourseSerializer()
    chapter = AdminChapterSerializer(allow_null=True)
    test = AdminTestSlimSerializer(allow_null=True)
