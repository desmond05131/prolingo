from django.urls import path
from streaks.views.client import (
    ClientMyDailyStreaksView,
    ClientCreateTodayDailyStreakView,
    ClientUseStreakSaverView,
)

urlpatterns = [
    path("dailystreaks/me/", ClientMyDailyStreaksView.as_view(), name="client_my_dailystreaks"),
    path("dailystreaks/today/", ClientCreateTodayDailyStreakView.as_view(), name="client_create_today_dailystreak"),
    path("dailystreaks/use-streak-saver/", ClientUseStreakSaverView.as_view(), name="client_use_streak_saver"),
]

__all__ = ["urlpatterns"]
