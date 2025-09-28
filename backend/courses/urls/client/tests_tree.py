from django.urls import path
from courses.views.client.tests_tree import ClientTestsTreeView

urlpatterns = [
    path("tests/tree/", ClientTestsTreeView.as_view(), name="client_tests_tree"),
]

__all__ = ["urlpatterns"]
