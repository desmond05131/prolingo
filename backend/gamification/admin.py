from django.contrib import admin
from .models import Leaderboard, Levels, DailyStreaks, Energy, Rewards

@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('user', 'streak_count', 'level', 'points')
    list_filter = ('level', 'points')
    search_fields = ('user__username',)
    ordering = ('-points', '-level', '-streak_count')

@admin.register(Levels)
class LevelsAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_level', 'rewards_earned_preview')
    list_filter = ('current_level',)
    search_fields = ('user__username',)
    ordering = ('-current_level',)
    
    def rewards_earned_preview(self, obj):
        return obj.rewards_earned[:50] + "..." if len(obj.rewards_earned) > 50 else obj.rewards_earned

@admin.register(DailyStreaks)
class DailyStreaksAdmin(admin.ModelAdmin):
    list_display = ('user', 'streak_count', 'streak_date')
    list_filter = ('streak_date', 'streak_count')
    search_fields = ('user__username',)
    ordering = ('-streak_count', '-streak_date')

@admin.register(Energy)
class EnergyAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_energy', 'last_updated')
    list_filter = ('current_energy', 'last_updated')
    search_fields = ('user__username',)
    ordering = ('-current_energy',)

@admin.register(Rewards)
class RewardsAdmin(admin.ModelAdmin):
    list_display = ('user', 'reward_type', 'earned_date')
    list_filter = ('reward_type', 'earned_date')
    search_fields = ('user__username',)
    ordering = ('-earned_date',)