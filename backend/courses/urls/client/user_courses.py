from django.urls import path
from courses.views.client.user_course import (
    ClientListUserCoursesView,
    ClientEnrollCourseView,
    ClientUnenrollCourseView,
)

urlpatterns = [
    path("user-courses/", ClientListUserCoursesView.as_view(), name="client_user_course_list"),
    # path("user-courses/<int:user_course_id>", ClientRetrieveUserCourseView.as_view(), name="client_user_course_detail"),
    # Enroll current user into a course
    path("user-courses/enroll/", ClientEnrollCourseView.as_view(), name="client_user_course_enroll"),
    # Unenroll (soft-delete) by enrollment id
    path("user-courses/<int:user_course_id>/unenroll/", ClientUnenrollCourseView.as_view(), name="client_user_course_unenroll"),
]

__all__ = ["urlpatterns"]
