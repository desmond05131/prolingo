from rest_framework import serializers
from .models import User, UserSettings
from gameinfo.models import UserGameInfos


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "profile_icon",
            "role",
            "registration_date",
            "is_premium",
        ]
        read_only_fields = ["id", "registration_date"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        # create default related models
        UserSettings.objects.create(user=user)
        UserGameInfos.objects.create(user=user)
        return user


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ["email_notifications", "streak_notifications"]
