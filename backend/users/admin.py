from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User, UserSettings


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
	fieldsets = (
		(None, {"fields": ("username", "password")}),
		("Personal info", {"fields": ("first_name", "last_name", "email", "profile_icon")} ),
		("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")} ),
		("Important dates", {"fields": ("last_login", "date_joined", "registration_date")} ),
		("Prolingo", {"fields": ("role", "is_premium")} ),
	)
	add_fieldsets = (
		(None, {
			'classes': ('wide',),
			'fields': ('username', 'email', 'password1', 'password2', 'role', 'is_premium'),
		}),
	)
	list_display = ("username", "email", "role", "is_premium", "is_staff")
	search_fields = ("username", "email")
	ordering = ("username",)


@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
	list_display = ("user", "email_notifications", "streak_notifications")
