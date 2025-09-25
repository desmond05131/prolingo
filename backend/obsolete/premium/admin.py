from django.contrib import admin
from .models import PremiumSubscription, PremiumFeature

@admin.register(PremiumSubscription)
class PremiumSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'plan_type', 'start_date', 'end_date')
    search_fields = ('user__username',)
    ordering = ('-start_date',)

@admin.register(PremiumFeature)
class PremiumFeatureAdmin(admin.ModelAdmin):
    list_display = ('id', 'subscription', 'feature_type', 'created_at')
    search_fields = ('subscription__user__username', 'feature_type')
    ordering = ('-created_at',)