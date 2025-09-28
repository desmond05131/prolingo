from rest_framework import serializers
from courses.models import Chapter

class AdminChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = [
            "chapter_id",
            "course",
            "title",
            "description",
            "learning_resource_url",
            "order_index",
        ]
        read_only_fields = ["chapter_id"]
