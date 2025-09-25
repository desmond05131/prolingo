from rest_framework import serializers
from courses.models import QuestionChoice

class AdminQuestionChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionChoice
        fields = [
            "choice_id",
            "question",
            "text",
            "order_index",
        ]
        read_only_fields = ["choice_id"]
