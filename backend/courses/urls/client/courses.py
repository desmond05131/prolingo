from django.urls import path
from courses.views.client.course import ClientListCoursesView, ClientRetrieveCourseView

urlpatterns = [
    path("courses/", ClientListCoursesView.as_view(), name="client_course_list"),
    path("courses/<int:course_id>", ClientRetrieveCourseView.as_view(), name="client_course_detail"),
]

__all__ = ["urlpatterns"]
