from rest_framework import serializers
from courses.models import Question

class ClientQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            "question_id",
            "test_id",
            "text",
            "type",
            "order_index",
        ]
        read_only_fields = fields
