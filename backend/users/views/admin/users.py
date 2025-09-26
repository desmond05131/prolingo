from rest_framework import generics, permissions
from users.models import User
from users.serializers import UserSerializer
from users.permissions import IsAdminRole


class AdminListUsersView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]


class AdminManageUserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_url_kwarg = "user_id"
