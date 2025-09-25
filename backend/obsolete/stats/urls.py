from django.urls import path
from . import views

urlpatterns = [
    path('', views.StatsDetailView.as_view(), name='stats-detail-self'),
	path('<int:pk>/', views.StatsDetailView.as_view(), name='stats-detail'),
    path('update/', views.StatsUpdateView.as_view(), name='stats-update-self'),
	path('<int:pk>/update/', views.StatsUpdateView.as_view(), name='stats-update'),
]
