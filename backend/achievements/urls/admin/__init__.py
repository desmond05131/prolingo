from django.urls import path
from achievements.views.admin import (
    AdminListAchievementsView,
    AdminManageAchievementView,
    AdminListUserClaimedAchievementsView,
    AdminManageUserClaimedAchievementView,
)

urlpatterns = [
    path("achievements/", AdminListAchievementsView.as_view(), name="admin_achievement_list"),
    path("achievements/<int:achievement_id>", AdminManageAchievementView.as_view(), name="admin_achievement_detail"),
    path(
        "user-claimed-achievements/",
        AdminListUserClaimedAchievementsView.as_view(),
        name="admin_user_claimed_achievement_list",
    ),
    path(
        "user-claimed-achievements/<int:user_claimed_achievement_id>",
        AdminManageUserClaimedAchievementView.as_view(),
        name="admin_user_claimed_achievement_detail",
    ),
]

__all__ = ["urlpatterns"]
