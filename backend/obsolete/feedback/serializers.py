from rest_framework import serializers
from .models import Feedback, AdminFeedbackResponse, AdminAction

class AdminFeedbackResponseSerializer(serializers.ModelSerializer):
    admin_username = serializers.ReadOnlyField(source="admin.username")

    class Meta:
        model = AdminFeedbackResponse
        fields = ["id", "feedback", "admin", "admin_username", "response_text", "response_date"]
        read_only_fields = ["admin", "admin_username", "response_date"]

class FeedbackSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source="user.username")
    responses = AdminFeedbackResponseSerializer(many=True, read_only=True)

    class Meta:
        model = Feedback
        fields = ["id", "user", "user_username", "message", "submitted_date", "responses"]
        read_only_fields = ["user", "user_username", "submitted_date", "responses"]

class AdminActionSerializer(serializers.ModelSerializer):
    admin_username = serializers.ReadOnlyField(source="admin.username")

    class Meta:
        model = AdminAction
        fields = ["id", "admin", "admin_username", "action_type", "target_id", "action_date", "details"]
        read_only_fields = ["admin", "admin_username", "action_date"]