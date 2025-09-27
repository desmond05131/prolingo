from rest_framework import generics, permissions
from gameinfo.models import UserGameInfos
from gameinfo.serializers.admin.user_game_infos import AdminUserGameInfosSerializer
from users.permissions import IsAdminRole

class AdminListGameInfosView(generics.ListAPIView):
    queryset = UserGameInfos.objects.select_related("user").all()
    serializer_class = AdminUserGameInfosSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class AdminManageGameInfoView(generics.RetrieveUpdateAPIView):
    queryset = UserGameInfos.objects.select_related("user").all()
    serializer_class = AdminUserGameInfosSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "gameinfo_id"
