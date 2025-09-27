from rest_framework import serializers
from courses.models import UserTest

class ClientUserTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTest
        fields = [
            "user_test_id",
            "test_id",
            "attempt_date",
            "time_spent",
            "correct_answer_count",
            "score_count",
        ]
        read_only_fields = fields
