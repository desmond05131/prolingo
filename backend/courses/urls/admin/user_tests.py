from django.urls import path
from courses.views.admin.user_test import (
    AdminListUserTestsView,
    AdminManageUserTestView,
)

urlpatterns = [
    path("user-tests/", AdminListUserTestsView.as_view(), name="admin_user_test_list"),
    path("user-tests/<int:user_test_id>", AdminManageUserTestView.as_view(), name="admin_user_test_detail"),
]

__all__ = ["urlpatterns"]
