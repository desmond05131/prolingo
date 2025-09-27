from rest_framework import serializers
from courses.models import UserTest

class AdminUserTestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    test_title = serializers.CharField(source="test.title", read_only=True)
    class Meta:
        model = UserTest
        fields = [
            "user_test_id",
            "user",
            "test",
            "attempt_date",
            "time_spent",
            "username",
            "test_title",
        ]
        read_only_fields = ["user_test_id", "attempt_date"]
