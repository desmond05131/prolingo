from django.contrib import admin
from .models import Feedback, AdminFeedbackResponse, AdminAction

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "submitted_date", "short_message")
    search_fields = ("user__username", "message")
    ordering = ("-submitted_date",)

    def short_message(self, obj):
        return obj.message[:60] + ("..." if len(obj.message) > 60 else "")

@admin.register(AdminFeedbackResponse)
class AdminFeedbackResponseAdmin(admin.ModelAdmin):
    list_display = ("id", "feedback", "admin", "response_date")
    search_fields = ("response_text", "admin__username")

@admin.register(AdminAction)
class AdminActionAdmin(admin.ModelAdmin):
    list_display = ("id", "admin", "action_type", "target_id", "action_date")
    search_fields = ("admin__username", "action_type", "target_id")
    ordering = ("-action_date",)