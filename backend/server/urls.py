from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import HttpResponse
from users.views import CustomTokenObtainPairView
from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),

    path("api/users/", include("users.urls")),
    path("api/notes/", include("notes.urls")),
    path("api/courses/", include("courses.urls")),
    path("api/stats/", include("stats.urls")),
    path('api/gamification/', include('gamification.urls')),
    path("api/feedback/", include("feedback.urls")),
    path("api/premium/", include("premium.urls")),

    path("", lambda request: HttpResponse("Welcome to Prolingo API"), name="home"),
    
    # Optional UI:
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
