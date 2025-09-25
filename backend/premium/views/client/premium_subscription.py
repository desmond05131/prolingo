from rest_framework import generics, permissions
from premium.models import PremiumSubscription
from premium.serializers.client import ClientPremiumSubscriptionSerializer


class ClientListActivePremiumSubscriptionView(generics.ListAPIView):
    serializer_class = ClientPremiumSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = PremiumSubscription.objects.filter(user=self.request.user).order_by("-subscription_id")
        return [sub for sub in qs if sub.is_active]
