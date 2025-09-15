from django.urls import path
from . import views

urlpatterns = [
    # Leaderboard
    path('leaderboard/', views.GetLeaderboardView.as_view(), name='get_leaderboard'),
    path('leaderboard/update/', views.UpdateLeaderboardView.as_view(), name='update_leaderboard'),
    
    # Levels
    path('levels/create/', views.CreateLevelView.as_view(), name='create_level'),
    path('levels/', views.GetLevelView.as_view(), name='get_level'),
    path('levels/update/', views.UpdateLevelView.as_view(), name='update_level'),
    path('levels/delete/', views.DeleteLevelView.as_view(), name='delete_level'),
    
    # Daily Streaks
    path('streaks/create/', views.CreateStreakView.as_view(), name='create_streak'),
    path('streaks/', views.GetStreakView.as_view(), name='get_streak'),
    path('streaks/update/', views.UpdateStreakView.as_view(), name='update_streak'),
    path('streaks/delete/', views.DeleteStreakView.as_view(), name='delete_streak'),
    
    # Energy
    path('energy/create/', views.CreateEnergyView.as_view(), name='create_energy'),
    path('energy/', views.GetEnergyView.as_view(), name='get_energy'),
    path('energy/update/', views.UpdateEnergyView.as_view(), name='update_energy'),
    path('energy/delete/', views.DeleteEnergyView.as_view(), name='delete_energy'),
    
    # Rewards
    path('rewards/create/', views.CreateRewardView.as_view(), name='create_reward'),
    path('rewards/', views.GetRewardsView.as_view(), name='get_rewards'),
    path('rewards/<int:pk>/update/', views.UpdateRewardView.as_view(), name='update_reward'),
    path('rewards/<int:pk>/delete/', views.DeleteRewardView.as_view(), name='delete_reward'),
    
    # Helper endpoints
    path('increment-streak/', views.increment_user_streak, name='increment_streak'),
    path('use-energy/', views.use_energy, name='use_energy'),
]