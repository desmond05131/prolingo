from rest_framework import serializers
from courses.models import QuestionChoice

class ClientQuestionChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionChoice
        fields = [
            "choice_id",
            "question_id",
            "text",
            "order_index",
        ]
        read_only_fields = fields
