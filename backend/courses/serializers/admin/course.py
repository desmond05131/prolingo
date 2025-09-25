from rest_framework import serializers
from courses.models import Course

class AdminCourseSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source="created_by.username", read_only=True)
    updated_by_username = serializers.CharField(source="updated_by.username", read_only=True)

    class Meta:
        model = Course
        fields = [
            "course_id",
            "title",
            "description",
            "status",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
            "created_by_username",
            "updated_by_username",
        ]
        read_only_fields = [
            "course_id",
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
            validated_data["created_by"] = request.user
            validated_data["updated_by"] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        if request and request.user:
            instance.updated_by = request.user
        return super().update(instance, validated_data)
