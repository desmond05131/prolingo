from rest_framework import serializers
from courses.models import UserTestAnswer

class AdminUserTestAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTestAnswer
        fields = [
            "user_test_answer_id",
            "user_test",
            "given_answer_text",
            "is_correct",
        ]
        read_only_fields = ["user_test_answer_id"]
