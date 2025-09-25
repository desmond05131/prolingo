from rest_framework import serializers
from courses.models import UserTest

class AdminUserTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTest
        fields = [
            "user_test_id",
            "user",
            "test",
            "attempt_date",
            "time_spent",
        ]
        read_only_fields = ["user_test_id", "attempt_date"]
