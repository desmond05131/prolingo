from django.urls import path
from premium.views.client import (
    ClientListActivePremiumSubscriptionView,
    ClientSubscriptionsView,
    ClientCompletePaymentView,
)

urlpatterns = [
    path("subscriptions/active/", ClientListActivePremiumSubscriptionView.as_view(), name="client_active_premium_subscriptions"),
    path("subscriptions/", ClientSubscriptionsView.as_view(), name="client_manage_premium_subscription"),  # POST & DELETE
    path("subscriptions/payment/", ClientCompletePaymentView.as_view(), name="client_complete_premium_payment"),  # POST
]

__all__ = ["urlpatterns"]
