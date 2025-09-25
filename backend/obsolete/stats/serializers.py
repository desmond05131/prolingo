from rest_framework import serializers
from .models import Stats

class StatsSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Stats
        fields = [
            "stats_id",
            "level",
            "xp",
            "streak",
            "streak_update_date",
            "energy",
            "last_energy_updated",
            "user",
        ]
        read_only_fields = ["stats_id", "user", "streak_update_date", "last_energy_updated"]
