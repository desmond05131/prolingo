from django.urls import path, include
from . import views

urlpatterns = [
    path("register/", views.CreateUserView.as_view(), name="register"),
    path("account/settings/", views.AccountSettingsView.as_view(), name="account-settings"),
    path("account/viewall/", views.AdminListUsersView.as_view(), name="account-viewall"),
    path("account/manage/", views.ManageAccountView.as_view(), name="account-manage"),
    path("account/manage/admin/", views.AdminManageUserView.as_view(), name="account-manage-user"),
    path("account/delete/", views.AdminDeleteUserView.as_view(), name="account-delete"),
]
