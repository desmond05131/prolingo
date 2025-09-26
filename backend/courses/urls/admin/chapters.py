from django.urls import path
from courses.views.admin.chapter import AdminListChaptersView, AdminManageChapterView

urlpatterns = [
    path("chapters/", AdminListChaptersView.as_view(), name="admin_chapter_list"),
    path("chapters/<int:chapter_id>", AdminManageChapterView.as_view(), name="admin_chapter_detail"),
]

__all__ = ["urlpatterns"]
