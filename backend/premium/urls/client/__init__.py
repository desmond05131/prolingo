from django.urls import path
from premium.views.client import (
    ClientListActivePremiumSubscriptionView,
)

urlpatterns = [
    path("subscriptions/active/", ClientListActivePremiumSubscriptionView.as_view(), name="client_active_premium_subscriptions"),
]

__all__ = ["urlpatterns"]
