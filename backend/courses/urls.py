from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


urlpatterns = [
    path("courses", views.CreateCourseView.as_view(), name="course"),
    path("courses/list", views.ListCoursesView.as_view(), name="course-list"),
    path("courses/manage/<int:pk>/", views.ManageCourseView.as_view(), name="course-manage"),
    path("courses/delete/<int:pk>/", views.DeleteCourseView.as_view(), name="course-delete"),
    path("chapters", views.CreateChapterView.as_view({"get": "list", "post": "create"}), name="chapter"),
    path("chapters/list", views.ListChaptersView.as_view(), name="chapter-list"),
    path("chapters/manage/<int:pk>/", views.ManageChapterView.as_view(), name="chapter-manage"),
    path("chapters/delete/<int:pk>/", views.DeleteChapterView.as_view(), name="chapter-delete"),
    path("tests", views.CreateTestView.as_view({"get": "list", "post": "create"}), name="test"),
    path("tests/list", views.ListTestsView.as_view(), name="test-list"),
    path("tests/manage/<int:pk>/", views.ManageTestView.as_view(), name="test-manage"),
    path("tests/delete/<int:pk>/", views.DeleteTestView.as_view(), name="test-delete"),
    path("questions", views.CreateQuestionView.as_view({"get": "list", "post": "create"}), name="question"),
    path("questions/list", views.ListQuestionsView.as_view(), name="question-list"),
    path("questions/manage/<int:pk>/", views.ManageQuestionView.as_view(), name="question-manage"),
    path("questions/delete/<int:pk>/", views.DeleteQuestionView.as_view(), name="question-delete"),
    path("options", views.CreateOptionView.as_view({"get": "list", "post": "create"}), name="option"),
    path("options/list", views.ListOptionsView.as_view(), name="option-list"),
    path("options/manage/<int:pk>/", views.ManageOptionView.as_view(), name="option-manage"),
    path("options/delete/<int:pk>/", views.DeleteOptionView.as_view(), name="option-delete"),
    path("results", views.CreateUserTestResultView.as_view({"get": "list", "post": "create"}), name="result"),
    path("results/list", views.ListUserTestResultsView.as_view(), name="result-list"),
    path("results/manage/<int:pk>/", views.ManageUserTestResultView.as_view(), name="result-manage"),
    path("results/delete/<int:pk>/", views.DeleteUserTestResultView.as_view(), name="result-delete"),

]