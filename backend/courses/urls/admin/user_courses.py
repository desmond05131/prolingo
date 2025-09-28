from django.urls import path
from courses.views.admin.user_course import (
    AdminListUserCoursesView,
    AdminManageUserCourseView,
)

urlpatterns = [
    path("user-courses/", AdminListUserCoursesView.as_view(), name="admin_user_course_list"),
    path("user-courses/<int:user_course_id>", AdminManageUserCourseView.as_view(), name="admin_user_course_detail"),
]

__all__ = ["urlpatterns"]
