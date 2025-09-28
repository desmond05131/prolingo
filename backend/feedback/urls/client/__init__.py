from django.urls import path
from feedback.views.client import (
    ClientListFeedbackView,
    ClientCreateFeedbackView,
)

urlpatterns = [
    path("feedback/", ClientListFeedbackView.as_view(), name="client_feedback_list"),
    path("feedback/create/", ClientCreateFeedbackView.as_view(), name="client_feedback_create"),
]

__all__ = ["urlpatterns"]
