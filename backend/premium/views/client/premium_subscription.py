from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from premium.models import PremiumSubscription
from premium.serializers.client import ClientPremiumSubscriptionSerializer
from premium.serializers.client.premium_subscription_create import (
    ClientCreatePremiumSubscriptionSerializer,
)


class ClientListActivePremiumSubscriptionView(generics.ListAPIView):
    serializer_class = ClientPremiumSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = PremiumSubscription.objects.filter(user=self.request.user).order_by("-subscription_id")
        return [sub for sub in qs if sub.is_active]


class ClientCreatePremiumSubscriptionView(generics.CreateAPIView):
    serializer_class = ClientCreatePremiumSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        # Return full subscription details with read serializer
        read_serializer = ClientPremiumSubscriptionSerializer(instance)
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ClientDeleteSubscriptionView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return (
            PremiumSubscription.objects
            .filter(user=self.request.user, status__in=[PremiumSubscription.Status.PENDING, PremiumSubscription.Status.ACTIVE])
            .order_by("-subscription_id")
            .first()
        )

    def delete(self, request, *args, **kwargs):
        subscription = self.get_object()
        if not subscription:
            return Response({"detail": "No active or pending subscription to cancel."}, status=status.HTTP_404_NOT_FOUND)
        subscription.is_renewable = False
        subscription.save(update_fields=["is_renewable", "updated_at"])  # minimal updates
        data = ClientPremiumSubscriptionSerializer(subscription).data
        return Response(data, status=status.HTTP_200_OK)


class ClientSubscriptionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ClientCreatePremiumSubscriptionSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        data = ClientPremiumSubscriptionSerializer(instance).data
        return Response(data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        subscription = (
            PremiumSubscription.objects
            .filter(user=request.user, status__in=[PremiumSubscription.Status.PENDING, PremiumSubscription.Status.ACTIVE])
            .order_by("-subscription_id")
            .first()
        )
        if not subscription:
            return Response({"detail": "No active or pending subscription to cancel."}, status=status.HTTP_404_NOT_FOUND)

        if subscription.status == PremiumSubscription.Status.PENDING:
            subscription.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Active subscription -> turn off auto-renew
        subscription.is_renewable = False
        subscription.save(update_fields=["is_renewable", "updated_at"])
        data = ClientPremiumSubscriptionSerializer(subscription).data
        return Response(data, status=status.HTTP_200_OK)


class ClientCompletePaymentView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClientPremiumSubscriptionSerializer

    def post(self, request, *args, **kwargs):
        # Find the most recent pending subscription and mark it paid/active
        subscription = (
            PremiumSubscription.objects
            .filter(user=request.user, status=PremiumSubscription.Status.PENDING)
            .order_by("-subscription_id")
            .first()
        )
        if not subscription:
            return Response({"detail": "No pending subscription found."}, status=status.HTTP_404_NOT_FOUND)
        subscription.status = PremiumSubscription.Status.ACTIVE
        subscription.save(update_fields=["status", "updated_at"])  # save() re-evaluates status vs dates if needed
        data = ClientPremiumSubscriptionSerializer(subscription).data
        return Response(data, status=status.HTTP_200_OK)
