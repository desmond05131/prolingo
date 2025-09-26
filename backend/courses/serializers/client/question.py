from rest_framework import serializers
from courses.models import Question
from .question_choice import ClientQuestionChoiceSerializer

class ClientQuestionSerializer(serializers.ModelSerializer):
    choices = ClientQuestionChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            "question_id",
            "test_id",
            "text",
            "type",
            "order_index",
            "choices",
        ]
        read_only_fields = fields
