from django.urls import path
from courses.views.admin.course import AdminListCoursesView, AdminManageCourseView

urlpatterns = [
    path("courses/", AdminListCoursesView.as_view(), name="admin_course_list"),
    path("courses/<int:course_id>", AdminManageCourseView.as_view(), name="admin_course_detail"),
]

__all__ = ["urlpatterns"]
