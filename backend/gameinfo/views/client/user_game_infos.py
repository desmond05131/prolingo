from rest_framework import generics, permissions
from gameinfo.models import UserGameInfos
from gameinfo.serializers.client.user_game_infos import ClientUserGameInfosSerializer

class MyGameInfoView(generics.RetrieveAPIView):
    serializer_class = ClientUserGameInfosSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return UserGameInfos.objects.select_related("user").get(user=self.request.user)
