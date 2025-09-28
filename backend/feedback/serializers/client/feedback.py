from rest_framework import serializers
from feedback.models import Feedback


class ClientFeedbackSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(
        source="created_by.username", read_only=True
    )
    updated_by_username = serializers.CharField(
        source="updated_by.username", read_only=True
    )

    class Meta:
        model = Feedback
        fields = [
            "feedback_id",
            "message",
            "created_by_username",
            "updated_by_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "feedback_id",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
            "created_by_username",
            "updated_by_username",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user and not validated_data.get("created_by"):
            user = request.user
            validated_data["created_by"] = user
            validated_data["updated_by"] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        if request and request.user:
            instance.updated_by = request.user
        return super().update(instance, validated_data)
