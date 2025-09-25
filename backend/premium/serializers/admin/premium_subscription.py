from rest_framework import serializers
from premium.models import PremiumSubscription


class AdminPremiumSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PremiumSubscription
        fields = [
            "subscription_id",
            "user",
            "type",
            "start_date",
            "end_date",
            "tier",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["subscription_id", "created_at", "updated_at"]
