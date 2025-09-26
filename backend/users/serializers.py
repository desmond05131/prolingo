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

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ["email_notifications", "streak_notifications"]
