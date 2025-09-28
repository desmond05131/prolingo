from django.contrib import admin
from .models import Achievement, UserClaimedAchievement

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = (
        "achievement_id",
        "reward_type",
        "reward_amount",
        "reward_content",
        "target_xp_value",
        "target_streak_value",
        "target_completed_test_id",
        "created_at",
        "updated_at",
    )
    list_filter = ("reward_type", "created_at")
    search_fields = (
        "achievement_id",
        "reward_content",
        "reward_content_description",
    )
    ordering = ("-achievement_id",)

@admin.register(UserClaimedAchievement)
class UserClaimedAchievementAdmin(admin.ModelAdmin):
    list_display = (
        "user_claimed_achievement_id",
        "user",
        "achievement",
        "claimed_date",
    )
    list_filter = ("claimed_date", "achievement__reward_type")
    search_fields = ("user__username", "achievement__achievement_id")
    autocomplete_fields = ("user", "achievement")
    ordering = ("-user_claimed_achievement_id",)
