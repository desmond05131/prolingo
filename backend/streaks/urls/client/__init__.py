from django.urls import path
from streaks.views.client import ClientMyDailyStreaksView, ClientCreateTodayDailyStreakView

urlpatterns = [
    path("dailystreaks/me/", ClientMyDailyStreaksView.as_view(), name="client_my_dailystreaks"),
    path("dailystreaks/today/", ClientCreateTodayDailyStreakView.as_view(), name="client_create_today_dailystreak"),
]

__all__ = ["urlpatterns"]
