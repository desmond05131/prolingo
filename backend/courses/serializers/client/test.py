from rest_framework import serializers
from courses.models import Test
from courses.serializers.client.chapter import ClientChapterSerializer
from courses.serializers.client.course import ClientCourseSerializer

class ClientTestSerializer(serializers.ModelSerializer):
    chapter = ClientChapterSerializer(read_only=True)
    course = ClientCourseSerializer(source="chapter.course", read_only=True)

    class Meta:
        model = Test
        fields = [
            "test_id",
            "chapter_id",
            "passing_score",
            "order_index",
            "title",
            "chapter",
            "course",
        ]
        read_only_fields = fields
