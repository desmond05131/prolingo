from rest_framework import generics, permissions
from gameinfo.models import UserGameInfos
from gameinfo.serializers.client.user_game_infos import ClientUserGameInfosSerializer

class MyGameInfoView(generics.RetrieveAPIView):
    serializer_class = ClientUserGameInfosSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        gameinfo, _ = UserGameInfos.objects.select_related("user").get_or_create(user=self.request.user)
        # Apply passive regeneration before returning
        gameinfo.apply_passive_energy_regen()
        return gameinfo
