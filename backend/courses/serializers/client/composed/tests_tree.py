from rest_framework import serializers
from courses.models import Test
from courses.serializers.client.course import ClientCourseSerializer
from courses.serializers.client.chapter import ClientChapterSerializer


class ClientTestSlimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = [
            "test_id",
            "passing_score",
            "order_index",
            "title",
        ]
        read_only_fields = fields


class ClientTestsFlatItemSerializer(serializers.Serializer):
    course = ClientCourseSerializer()
    chapter = ClientChapterSerializer(allow_null=True)
    test = ClientTestSlimSerializer(allow_null=True)
    # Status of the test for the user: one of "passed", "active", "locked"; null when no test
    status = serializers.CharField(allow_null=True, required=False)
