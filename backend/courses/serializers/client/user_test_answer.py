from rest_framework import serializers
from courses.models import UserTestAnswer

class ClientUserTestAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTestAnswer
        fields = [
            "user_test_answer_id",
            "user_test_id",
            "given_answer_text",
            "is_correct",
        ]
        read_only_fields = fields
