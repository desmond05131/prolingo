from django.urls import path
from gameinfo.views.client import MyGameInfoView
from gameinfo.views.client.leaderboard import Top50LeaderboardView, MyLeaderboardRankView

urlpatterns = [
    path("gameinfo/me/", MyGameInfoView.as_view(), name="client_my_gameinfo"),
    path("leaderboard/top50/", Top50LeaderboardView.as_view(), name="client_leaderboard_top50"),
    path("leaderboard/me/", MyLeaderboardRankView.as_view(), name="client_leaderboard_me"),
]

__all__ = ["urlpatterns"]