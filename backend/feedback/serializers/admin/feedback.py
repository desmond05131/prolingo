from rest_framework import serializers
from feedback.models import Feedback


class AdminFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = [
            "feedback_id",
            "message",
            "created_by",
            "created_date",
            "updated_by",
            "updated_date",
        ]
        read_only_fields = ["feedback_id", "created_date", "updated_date"]
