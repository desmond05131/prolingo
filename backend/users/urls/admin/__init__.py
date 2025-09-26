from django.urls import path
from users.views.admin.users import AdminListUsersView, AdminManageUserView

urlpatterns = [
    path("users/", AdminListUsersView.as_view(), name="admin_user_list"),
    path("users/<int:user_id>", AdminManageUserView.as_view(), name="admin_user_detail"),
]

__all__ = ["urlpatterns"]
