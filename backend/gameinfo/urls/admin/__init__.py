from django.urls import path
from gameinfo.views.admin import AdminListGameInfosView, AdminManageGameInfoView

urlpatterns = [
    path("gameinfos/", AdminListGameInfosView.as_view(), name="admin_gameinfo_list"),
    path("gameinfos/<int:gameinfo_id>", AdminManageGameInfoView.as_view(), name="admin_gameinfo_detail"),
]

__all__ = ["urlpatterns"]