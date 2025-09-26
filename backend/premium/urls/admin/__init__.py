from django.urls import path
from premium.views.admin import (
    AdminListPremiumSubscriptionView,
    AdminManagePremiumSubscriptionView,
)

urlpatterns = [
    path("subscriptions/", AdminListPremiumSubscriptionView.as_view(), name="admin_premium_subscription_list"),
    path("subscriptions/<int:subscription_id>", AdminManagePremiumSubscriptionView.as_view(), name="admin_premium_subscription_detail"),
]

__all__ = ["urlpatterns"]
