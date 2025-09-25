from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from datetime import timedelta

from .models import PremiumSubscription, PremiumFeature
from .serializers import PremiumSubscriptionSerializer, PremiumFeatureSerializer
from users.permissions import IsAdminRole, IsOwnerOrAdmin

# Subscriptions
class CreateSubscriptionView(generics.CreateAPIView):
    serializer_class = PremiumSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # compute end_date automatically in model.save if not provided
        serializer.save(user=self.request.user)

class GetSubscriptionView(generics.RetrieveAPIView):
    """
    Get active subscription for current user (or for user_id if admin passes ?user_id=)
    """
    serializer_class = PremiumSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if self.request.query_params.get('user_id') and (getattr(self.request.user, "role", None) == "admin" or self.request.user.is_staff):
            user_id = self.request.query_params.get('user_id')
            # allow admin to fetch specific user's active subscription
            return get_object_or_404(PremiumSubscription, user_id=user_id, start_date__lte=timezone.now(), end_date__gte=timezone.now())
        return get_object_or_404(PremiumSubscription, user=user, start_date__lte=timezone.now(), end_date__gte=timezone.now())

class UpdateSubscriptionView(generics.RetrieveUpdateAPIView):
    serializer_class = PremiumSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    queryset = PremiumSubscription.objects.all()

    def perform_update(self, serializer):
        # allow simple renew/change: adjust end_date if plan_type changed or renew flag passed
        instance = self.get_object()
        data = self.request.data
        plan_type = data.get('plan_type', instance.plan_type)
        renew = data.get('renew', False)
        now = timezone.now()

        if plan_type != instance.plan_type:
            # change plan: start now, set end_date based on new plan
            instance.start_date = now
            if plan_type == PremiumSubscription.PLAN_YEARLY:
                instance.end_date = now + timedelta(days=365)
            else:
                instance.end_date = now + timedelta(days=30)
            instance.plan_type = plan_type
        elif renew:
            # extend from current end_date
            if instance.plan_type == PremiumSubscription.PLAN_YEARLY:
                instance.end_date = instance.end_date + timedelta(days=365)
            else:
                instance.end_date = instance.end_date + timedelta(days=30)

        serializer.save()

class DeleteSubscriptionView(generics.DestroyAPIView):
    serializer_class = PremiumSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    queryset = PremiumSubscription.objects.all()

# Features
class CreatePremiumFeatureView(generics.CreateAPIView):
    serializer_class = PremiumFeatureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # ensure user owns the subscription (or admin)
        subscription = get_object_or_404(PremiumSubscription, pk=self.request.data.get('subscription'))
        if subscription.user != self.request.user and not (getattr(self.request.user, "role", None) == "admin" or self.request.user.is_staff):
            raise permissions.PermissionDenied("Not allowed to add feature to this subscription")
        serializer.save()

class GetPremiumFeaturesView(generics.ListAPIView):
    serializer_class = PremiumFeatureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # admin can pass ?user_id= to list features for a user
        user = self.request.user
        user_id = self.request.query_params.get('user_id')
        if user_id and (getattr(user, "role", None) == "admin" or user.is_staff):
            return PremiumFeature.objects.filter(subscription__user_id=user_id).order_by('-created_at')
        return PremiumFeature.objects.filter(subscription__user=user).order_by('-created_at')

class UpdatePremiumFeatureView(generics.RetrieveUpdateAPIView):
    serializer_class = PremiumFeatureSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    queryset = PremiumFeature.objects.all()

class DeletePremiumFeatureView(generics.DestroyAPIView):
    serializer_class = PremiumFeatureSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    queryset = PremiumFeature.objects.all()