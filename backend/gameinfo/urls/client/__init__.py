from django.urls import path
from gameinfo.views.client import MyGameInfoView

urlpatterns = [
    path("gameinfo/me/", MyGameInfoView.as_view(), name="client_my_gameinfo"),
]

__all__ = ["urlpatterns"]