from rest_framework import generics, permissions
from premium.models import PremiumSubscription
from premium.serializers.admin import AdminPremiumSubscriptionSerializer
from users.permissions import IsAdminRole


class AdminListPremiumSubscriptionView(generics.ListCreateAPIView):
    queryset = PremiumSubscription.objects.select_related("user").all()
    serializer_class = AdminPremiumSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]


class AdminManagePremiumSubscriptionView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PremiumSubscription.objects.select_related("user").all()
    serializer_class = AdminPremiumSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "subscription_id"
