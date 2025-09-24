from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, UserSettings
from .serializers import UserSerializer, UserSettingsSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from stats.models import Stats
from .permissions import IsAdminRole

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ManageAccountView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class AdminListUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

class AdminManageUserView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

class AdminDeleteUserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

class AccountSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Ensure settings exists (created in serializer, but guard anyway)
        settings, _ = UserSettings.objects.get_or_create(user=self.request.user)
        return settings

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = User.objects.get(username=request.data.get("username"))
        try:
            stats = user.stats
            print(stats, user, response, request, args, kwargs)
            stats.reset_energy()
            stats.check_streak()
        except Stats.DoesNotExist:
            Stats.objects.create(user=user)
        return response
