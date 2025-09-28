from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from django.db.models import F
from .models import Leaderboard, Levels, DailyStreaks, Energy, Rewards
from .serializers import (
    LeaderboardSerializer, LevelsSerializer, DailyStreaksSerializer,
    EnergySerializer, RewardsSerializer
)
import json
from users.permissions import IsAdminRole, IsOwnerOrAdmin

# Leaderboard Views
class GetLeaderboardView(generics.ListAPIView):
    """Fetch top users by points/level"""
    serializer_class = LeaderboardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Leaderboard.objects.all()[:50]  # Top 50 users

class UpdateLeaderboardView(generics.RetrieveUpdateAPIView):
    """Update user's rank"""
    serializer_class = LeaderboardSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        leaderboard, _ = Leaderboard.objects.get_or_create(user=self.request.user)
        return leaderboard

# Levels Views
class CreateLevelView(generics.CreateAPIView):
    """Assign starting level (admin only)"""
    serializer_class = LevelsSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
    def perform_create(self, serializer):
        user_id = self.request.data.get('user_id')
        if user_id:
            from users.models import User
            user = User.objects.get(id=user_id)
            serializer.save(user=user)

class GetLevelView(generics.RetrieveAPIView):
    """Get current level"""
    serializer_class = LevelsSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        level, _ = Levels.objects.get_or_create(user=self.request.user)
        return level

class UpdateLevelView(generics.RetrieveUpdateAPIView):
    """Increase level when conditions are met"""
    serializer_class = LevelsSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        level, _ = Levels.objects.get_or_create(user=self.request.user)
        return level

class DeleteLevelView(generics.DestroyAPIView):
    """Reset level progress"""
    serializer_class = LevelsSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        return Levels.objects.get(user=self.request.user)

# Daily Streaks Views
class CreateStreakView(generics.CreateAPIView):
    """Start streak"""
    serializer_class = DailyStreaksSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GetStreakView(generics.RetrieveAPIView):
    """Retrieve streak status"""
    serializer_class = DailyStreaksSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        streak, _ = DailyStreaks.objects.get_or_create(user=self.request.user)
        return streak

class UpdateStreakView(generics.RetrieveUpdateAPIView):
    """Increment streak"""
    serializer_class = DailyStreaksSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        streak, _ = DailyStreaks.objects.get_or_create(user=self.request.user)
        return streak
    
    def perform_update(self, serializer):
        # Auto-increment streak count
        instance = serializer.instance
        today = timezone.now().date()
        
        if instance.streak_date < today:
            # Update streak for new day
            instance.streak_count += 1
            instance.streak_date = today
        
        serializer.save()

class DeleteStreakView(generics.DestroyAPIView):
    """Reset streak"""
    serializer_class = DailyStreaksSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        return DailyStreaks.objects.get(user=self.request.user)

# Energy Views
class CreateEnergyView(generics.CreateAPIView):
    """Initialize energy"""
    serializer_class = EnergySerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GetEnergyView(generics.RetrieveAPIView):
    """Fetch energy level"""
    serializer_class = EnergySerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        energy, _ = Energy.objects.get_or_create(user=self.request.user)
        return energy

class UpdateEnergyView(generics.RetrieveUpdateAPIView):
    """Decrease/increase energy"""
    serializer_class = EnergySerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        energy, _ = Energy.objects.get_or_create(user=self.request.user)
        return energy

class DeleteEnergyView(generics.DestroyAPIView):
    """Reset energy"""
    serializer_class = EnergySerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        return Energy.objects.get(user=self.request.user)

# Rewards Views
class CreateRewardView(generics.CreateAPIView):
    """Add reward when unlocked"""
    serializer_class = RewardsSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GetRewardsView(generics.ListAPIView):
    """List earned rewards"""
    serializer_class = RewardsSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return Rewards.objects.filter(user=self.request.user)

class UpdateRewardView(generics.RetrieveUpdateAPIView):
    """Update reward status"""
    serializer_class = RewardsSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return Rewards.objects.filter(user=self.request.user)

class DeleteRewardView(generics.DestroyAPIView):
    """Remove reward"""
    serializer_class = RewardsSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return Rewards.objects.filter(user=self.request.user)

# Helper API endpoints for game mechanics
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def increment_user_streak(request):
    """Helper function to increment user streak and update leaderboard"""
    try:
        # Update streak
        streak, _ = DailyStreaks.objects.get_or_create(user=request.user)
        today = timezone.now().date()
        
        if streak.streak_date < today:
            streak.streak_count += 1
            streak.streak_date = today
            streak.save()
        
        # Update leaderboard
        leaderboard, _ = Leaderboard.objects.get_or_create(user=request.user)
        leaderboard.streak_count = streak.streak_count
        leaderboard.points += 10  # Award points for streak
        leaderboard.save()
        
        return Response({
            'success': True,
            'streak_count': streak.streak_count,
            'points': leaderboard.points
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def use_energy(request):
    """Helper function to decrease user energy"""
    try:
        energy_amount = request.data.get('amount', 10)
        energy, _ = Energy.objects.get_or_create(user=request.user)
        
        if energy.current_energy >= energy_amount:
            energy.current_energy -= energy_amount
            energy.save()
            return Response({
                'success': True,
                'current_energy': energy.current_energy
            })
        else:
            return Response({
                'error': 'Insufficient energy'
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)