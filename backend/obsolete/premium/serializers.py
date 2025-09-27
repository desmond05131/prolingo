from rest_framework import serializers
from .models import PremiumSubscription, PremiumFeature

class PremiumFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PremiumFeature
        fields = ['id', 'subscription', 'feature_type', 'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']

class PremiumSubscriptionSerializer(serializers.ModelSerializer):
    features = PremiumFeatureSerializer(many=True, read_only=True)
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = PremiumSubscription
        fields = ['id', 'user', 'plan_type', 'start_date', 'end_date', 'is_active', 'features']
        read_only_fields = ['id', 'user', 'is_active', 'features']

    def get_is_active(self, obj):
        return obj.is_active()

    def validate(self, data):
        # ensure plan_type present
        plan_type = data.get('plan_type') or getattr(self.instance, 'plan_type', None)
        if plan_type not in (PremiumSubscription.PLAN_MONTHLY, PremiumSubscription.PLAN_YEARLY):
            raise serializers.ValidationError("Invalid plan_type")
        return data