from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


urlpatterns = [
    path("courses", views.CourseViewSet.as_view({"get": "list", "post": "create"}), name="course"),
    path("courses/<int:pk>", views.CourseViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="course-detail"),
    path("chapters", views.ChapterViewSet.as_view({"get": "list", "post": "create"}), name="chapter"),
    path("chapters/<int:pk>", views.ChapterViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="chapter-detail"),
    path("tests", views.TestViewSet.as_view({"get": "list", "post": "create"}), name="test"),
    path("tests/<int:pk>", views.TestViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="test-detail"),
    path("questions", views.QuestionViewSet.as_view({"get": "list", "post": "create"}), name="question"),
    path("questions/<int:pk>", views.QuestionViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="question-detail"),
    path("options", views.OptionViewSet.as_view({"get": "list", "post": "create"}), name="option"),
    path("options/<int:pk>", views.OptionViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="option-detail"),
    path("enroll/", views.EnrollView.as_view(), name="enroll"),

]