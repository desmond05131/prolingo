from django.urls import path
from achievements.views.client import (
    ClientListAchievementsView,
    ClientListUserClaimedAchievementsView,
    ClientClaimAchievementView,
)

urlpatterns = [
    path("achievements/", ClientListAchievementsView.as_view(), name="client_achievement_list"),
    path(
        "user-claimed-achievements/",
        ClientListUserClaimedAchievementsView.as_view(),
        name="client_user_claimed_achievement_list",
    ),
    path(
        "achievements/<int:achievement_id>/claim/",
        ClientClaimAchievementView.as_view(),
        name="client_claim_achievement",
    ),
]

__all__ = ["urlpatterns"]
