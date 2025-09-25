from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from django.http import HttpResponse
from users.views import CustomTokenObtainPairView
from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),

    path("api/users/", include("users.urls")),
    # Game info (admin + client)
    path("api/gameinfo/", include("gameinfo.urls.admin")),
    path("api/client/gameinfo/", include("gameinfo.urls.client")),
    # Daily streaks (admin + client)
    path("api/streaks/", include("streaks.urls.admin")),
    path("api/client/streaks/", include("streaks.urls.client")),
    # Achievements (admin + client)
    path("api/achievements/", include("achievements.urls.admin")),
    path("api/client/achievements/", include("achievements.urls.client")),
    # Courses (admin + client)
    path("api/courses/", include("courses.urls.admin")),
    path("api/client/courses/", include("courses.urls.client")),
    # Feedback (admin + client)
    path("api/feedback/", include("feedback.urls.admin")),
    path("api/client/feedback/", include("feedback.urls.client")),
    # Premium subscriptions (admin + client)
    path("api/premium/", include("premium.urls.admin")),
    path("api/client/premium/", include("premium.urls.client")),
    # path("api/notes/", include("notes.urls")),
    # path("api/courses/", include("courses.urls")),
    # path("api/stats/", include("stats.urls")),
    # path('api/gamification/', include('gamification.urls')),
    # path("api/feedback/", include("feedback.urls")),
    # path("api/premium/", include("premium.urls")),

    path("", lambda request: HttpResponse("Welcome to Prolingo API"), name="home"),
    
    # Optional UI:
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
