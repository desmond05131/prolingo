from rest_framework import serializers
from .models import Leaderboard, Levels, DailyStreaks, Energy, Rewards
import json

class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'username', 'streak_count', 'level', 'points']
        read_only_fields = ['user', 'username']

class LevelsSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    rewards_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Levels
        fields = ['id', 'user', 'username', 'current_level', 'rewards_earned', 'rewards_list']
        read_only_fields = ['user', 'username']
    
    def get_rewards_list(self, obj):
        try:
            return json.loads(obj.rewards_earned) if obj.rewards_earned else []
        except json.JSONDecodeError:
            return []

class DailyStreaksSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = DailyStreaks
        fields = ['id', 'user', 'username', 'streak_date', 'streak_count']
        read_only_fields = ['user', 'username']

class EnergySerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Energy
        fields = ['id', 'user', 'username', 'current_energy', 'last_updated']
        read_only_fields = ['user', 'username', 'last_updated']

class RewardsSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Rewards
        fields = ['id', 'user', 'username', 'reward_type', 'earned_date']
        read_only_fields = ['user', 'username', 'earned_date']