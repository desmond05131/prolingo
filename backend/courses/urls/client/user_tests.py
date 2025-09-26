from django.urls import path
from courses.views.client.user_test import (
    ClientListUserTestsView,
    ClientRetrieveUserTestView,
)

urlpatterns = [
    path("user-tests/", ClientListUserTestsView.as_view(), name="client_user_test_list"),
    path("user-tests/<int:user_test_id>", ClientRetrieveUserTestView.as_view(), name="client_user_test_detail"),
]

__all__ = ["urlpatterns"]
