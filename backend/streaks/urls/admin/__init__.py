from django.urls import path
from streaks.views.admin import AdminListDailyStreaksView, AdminManageDailyStreakView

urlpatterns = [
    path("dailystreaks/", AdminListDailyStreaksView.as_view(), name="admin_dailystreak_list"),
    path("dailystreaks/<int:daily_streak_id>", AdminManageDailyStreakView.as_view(), name="admin_dailystreak_detail"),
]

__all__ = ["urlpatterns"]
