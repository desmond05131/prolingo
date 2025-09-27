from django.urls import path
from feedback.views.admin import (
    AdminListFeedbackView,
    AdminManageFeedbackView,
)

urlpatterns = [
    path("feedback/", AdminListFeedbackView.as_view(), name="admin_feedback_list"),
    path("feedback/<int:feedback_id>", AdminManageFeedbackView.as_view(), name="admin_feedback_detail"),
]

__all__ = ["urlpatterns"]
