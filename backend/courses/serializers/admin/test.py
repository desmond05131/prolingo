from rest_framework import serializers
from courses.models import Test

class AdminTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = [
            "test_id",
            "chapter",
            "passing_score",
            "order_index",
        ]
        read_only_fields = ["test_id"]
