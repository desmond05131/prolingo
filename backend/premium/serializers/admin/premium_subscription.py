from django.contrib.auth import get_user_model
from rest_framework import serializers
from premium.models import PremiumSubscription

User = get_user_model()

class AdminPremiumSubscriptionSerializer(serializers.ModelSerializer):
    # accept and return numeric user id
    user_id = serializers.PrimaryKeyRelatedField(
        source="user",
        queryset=User.objects.all(),
        required=True,
    )
    # return username
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = PremiumSubscription
        fields = [
            "subscription_id",
            "user_id",
            "username",
            "type",
            "start_date",
            "end_date",
            "status",
            "is_renewable",
            "amount",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["subscription_id", "created_at", "updated_at"]
