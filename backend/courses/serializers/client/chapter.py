from rest_framework import serializers
from courses.models import Chapter

class ClientChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = [
            "chapter_id",
            "course_id",
            "title",
            "description",
            "learning_resource_url",
            "order_index",
        ]
        read_only_fields = fields
