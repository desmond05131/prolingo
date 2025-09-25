from rest_framework import serializers
from courses.models import Question

class AdminQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            "question_id",
            "test",
            "text",
            "type",
            "correct_answer_text",
            "order_index",
        ]
        read_only_fields = ["question_id"]
