from rest_framework import serializers
from feedback.models import Feedback


class ClientFeedbackSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source="created_by.username", read_only=True)

    class Meta:
        model = Feedback
        fields = [
            "feedback_id",
            "message",
            "created_by_username",
            "created_date",
            "updated_date",
        ]
        read_only_fields = fields
