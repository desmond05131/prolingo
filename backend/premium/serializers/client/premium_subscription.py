from rest_framework import serializers
from premium.models import PremiumSubscription


class ClientPremiumSubscriptionSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = PremiumSubscription
        fields = [
            "subscription_id",
            "type",
            "tier",
            "start_date",
            "end_date",
            "is_active",
        ]
        read_only_fields = fields
