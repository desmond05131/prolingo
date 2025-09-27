from rest_framework import serializers
from .models import User, UserSettings
from gameinfo.models import UserGameInfos


class UserSerializer(serializers.ModelSerializer):
    # Require users to supply their current password when changing it via update
    current_password = serializers.CharField(write_only=True, required=False, allow_blank=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "current_password",
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
        # Extract non-model extra field first to avoid setattr
        current_password = validated_data.pop("current_password", None)
        password = validated_data.pop("password", None)

        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Handle password change with verification of current password
        if password is not None:
            # If the user has a usable password, require verifying it
            if instance.has_usable_password():
                if not current_password:
                    raise serializers.ValidationError({
                        "current_password": "This field is required to change the password.",
                    })
                if not instance.check_password(current_password):
                    raise serializers.ValidationError({
                        "current_password": "Incorrect current password.",
                    })
            # Set the new password
            instance.set_password(password)

        instance.save()
        return instance


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ["email_notifications", "streak_notifications"]
