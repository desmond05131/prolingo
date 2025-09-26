from django.urls import path
from courses.views.client.chapter import ClientListChaptersView, ClientRetrieveChapterView

urlpatterns = [
    path("chapters/", ClientListChaptersView.as_view(), name="client_chapter_list"),
    path("chapters/<int:chapter_id>", ClientRetrieveChapterView.as_view(), name="client_chapter_detail"),
]

__all__ = ["urlpatterns"]
