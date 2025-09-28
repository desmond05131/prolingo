from django.urls import path
from users.views.client.users import ClientMeView, ClientAccountSettingsView
from users.views import CreateUserView

urlpatterns = [
    # Public registration
    path("register/", CreateUserView.as_view(), name="register"),
    # Authenticated self endpoints
    path("me/", ClientMeView.as_view(), name="client_me"),
    path("me/settings/", ClientAccountSettingsView.as_view(), name="client_me_settings"),
]

__all__ = ["urlpatterns"]
