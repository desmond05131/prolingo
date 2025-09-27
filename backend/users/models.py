from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.conf import settings


class User(AbstractUser):
	"""
	Custom user model extending Django's AbstractUser.
	- email unique
	- profile_icon optional string (URL/path)
	- role choices: student | lecturer | admin
	- registration_date auto default now
	- is_premium flag
	Note: Django stores password hashes in the built-in `password` field.
	"""

	ROLE_STUDENT = "student"
	ROLE_LECTURER = "lecturer"
	ROLE_ADMIN = "admin"
	ROLE_CHOICES = [
		(ROLE_STUDENT, "Student"),
		(ROLE_LECTURER, "Lecturer"),
		(ROLE_ADMIN, "Admin"),
	]

	email = models.EmailField(unique=True)
	# Allow storing long base64-encoded images
	profile_icon = models.TextField(null=True, blank=True)
	role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_STUDENT)
	registration_date = models.DateTimeField(default=timezone.now)
	is_premium = models.BooleanField(default=False)

	def __str__(self):
		return self.username


class UserSettings(models.Model):
	"""Per-user notification settings."""

	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="settings",
	)
	email_notifications = models.BooleanField(default=True)
	streak_notifications = models.BooleanField(default=True)

	class Meta:
		verbose_name = "User Settings"
		verbose_name_plural = "User Settings"

	def __str__(self):
		return f"Settings<{self.user.username}>"

