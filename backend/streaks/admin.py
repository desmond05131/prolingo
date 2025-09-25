from django.contrib import admin
from .models import DailyStreak

@admin.register(DailyStreak)
class DailyStreakAdmin(admin.ModelAdmin):
    list_display = ("daily_streak_id", "user", "daily_streak_date")
    list_filter = ("daily_streak_date",)
    search_fields = ("user__username", "user__email")
    ordering = ("-daily_streak_date",)
