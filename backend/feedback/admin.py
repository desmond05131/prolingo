from django.contrib import admin
from .models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = (
        "feedback_id",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
    )
    list_filter = ("created_at", "updated_at")
    search_fields = ("feedback_id", "message", "created_by__username")
    autocomplete_fields = ("created_by", "updated_by")
    ordering = ("-updated_at",)
