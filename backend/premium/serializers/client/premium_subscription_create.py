from rest_framework import serializers
from premium.models import PremiumSubscription


class ClientCreatePremiumSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PremiumSubscription
        # client can only choose type, is_renewable flag, and optionally amount
        # user, dates, and status are server-controlled
        fields = [
            "type",
            "is_renewable",
            "amount",
        ]
        extra_kwargs = {
            "is_renewable": {"required": False, "default": True},
            "amount": {"required": False},
        }

    def validate(self, attrs):
        # Enforce only one subscription (pending or active) per user
        user = self.context["request"].user
        from premium.models import PremiumSubscription  # local import to avoid cycles on app load
        exists = PremiumSubscription.objects.filter(
            user=user,
            status__in=[
                PremiumSubscription.Status.PENDING,
                PremiumSubscription.Status.ACTIVE,
            ],
        ).exists()
        if exists:
            raise serializers.ValidationError("You already have an active or pending subscription.")
        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        # Start with pending status, PremiumSubscription.save() will compute dates/status
        subscription = PremiumSubscription.objects.create(user=user, **validated_data)
        return subscription
