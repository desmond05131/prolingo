from django.urls import path
from courses.views.client.user_course import (
    ClientListUserCoursesView,
    ClientRetrieveUserCourseView,
)

urlpatterns = [
    path("user-courses/", ClientListUserCoursesView.as_view(), name="client_user_course_list"),
    path("user-courses/<int:user_course_id>/", ClientRetrieveUserCourseView.as_view(), name="client_user_course_detail"),
]

__all__ = ["urlpatterns"]
