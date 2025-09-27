from django.contrib import admin
from .models import UserGameInfos

@admin.register(UserGameInfos)
class UserGameInfosAdmin(admin.ModelAdmin):
    list_display = ("gameinfo_id", "user", "xp_value", "energy_value", "energy_last_updated_date")
    search_fields = ("user__username", "user__email")
    list_filter = ("energy_last_updated_date",)
