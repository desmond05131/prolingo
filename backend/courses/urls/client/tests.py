from django.urls import path
from courses.views.client.test import ClientListTestsView, ClientRetrieveTestView

urlpatterns = [
    path("tests/", ClientListTestsView.as_view(), name="client_test_list"),
    path("tests/<int:test_id>", ClientRetrieveTestView.as_view(), name="client_test_detail"),
]

__all__ = ["urlpatterns"]
