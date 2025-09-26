from rest_framework import serializers
from courses.models import Test
from courses.serializers.admin.chapter import AdminChapterSerializer
from courses.serializers.admin.course import AdminCourseSerializer

class AdminTestSerializer(serializers.ModelSerializer):
    # Keep 'chapter' as writable PK for create/update in admin
    # Add nested read-only details alongside
    chapter_detail = AdminChapterSerializer(source="chapter", read_only=True)
    course = AdminCourseSerializer(source="chapter.course", read_only=True)

    class Meta:
        model = Test
        fields = [
            "test_id",
            "chapter",
            "passing_score",
            "order_index",
            "title",
            "chapter_detail",
            "course",
        ]
        read_only_fields = ["test_id"]
