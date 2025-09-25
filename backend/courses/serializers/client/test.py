from rest_framework import serializers
from courses.models import Test

class ClientTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = [
            "test_id",
            "chapter_id",
            "passing_score",
            "order_index",
            "title",
        ]
        read_only_fields = fields
