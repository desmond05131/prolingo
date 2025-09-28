from rest_framework import serializers
from .models import User, UserSettings
from gameinfo.models import UserGameInfos
from users.permissions import IsAdminRole


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
            # Determine whether current password is required using permission logic
            require_current = True
            request = self.context.get("request") if hasattr(self, "context") else None
            view = self.context.get("view") if hasattr(self, "context") else None
            if request is not None:
                try:
                    # Use the same admin definition as in permissions
                    is_admin_context = IsAdminRole().has_permission(request, view)
                except Exception:
                    # Fallback to staff/superuser flags
                    is_admin_context = bool(getattr(request.user, "is_staff", False) or getattr(request.user, "is_superuser", False))
                if is_admin_context:
                    require_current = False

            # If the user has a usable password and we're in client context, verify it
            if require_current and instance.has_usable_password():
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
