from django.urls import path
from courses.views.client.submit_user_test import ClientSubmitUserTestView

urlpatterns = [
    path("user-tests/submit/", ClientSubmitUserTestView.as_view(), name="client_user_test_submit"),
]

__all__ = ["urlpatterns"]
