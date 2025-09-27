from django.urls import path
from courses.views.admin.test import AdminListTestsView, AdminManageTestView

urlpatterns = [
    path("tests/", AdminListTestsView.as_view(), name="admin_test_list"),
    path("tests/<int:test_id>", AdminManageTestView.as_view(), name="admin_test_detail"),
]

__all__ = ["urlpatterns"]
