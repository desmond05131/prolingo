from django.urls import path
from courses.views.admin.tests_tree import AdminTestsTreeView

urlpatterns = [
    path("tests/tree/", AdminTestsTreeView.as_view(), name="admin_tests_tree"),
]

__all__ = ["urlpatterns"]
