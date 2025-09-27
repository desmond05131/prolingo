from django.contrib import admin
from .models import PremiumSubscription


@admin.register(PremiumSubscription)
class PremiumSubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "subscription_id",
        "user",
        "type",
        "status",
        "start_date",
        "end_date",
        "is_renewable",
        "amount",
        "created_at",
        "updated_at",
    )
    list_filter = ("type", "status", "is_renewable")
    search_fields = (
        "subscription_id",
        "user__username",
    )
    autocomplete_fields = ("user",)
    ordering = ("-updated_at",)
