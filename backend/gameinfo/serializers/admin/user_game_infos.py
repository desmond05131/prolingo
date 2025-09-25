from rest_framework import serializers
from ...models import UserGameInfos

class AdminUserGameInfosSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGameInfos
        fields = [
            "gameinfo_id",
            "user",
            "xp_value",
            "energy_value",
            "energy_last_updated_date",
        ]
        read_only_fields = ["gameinfo_id", "energy_last_updated_date"]
