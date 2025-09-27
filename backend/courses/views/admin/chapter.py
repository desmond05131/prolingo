from rest_framework import generics, permissions
from courses.models import Chapter
from courses.serializers.admin.chapter import AdminChapterSerializer
from users.permissions import IsAdminRole

class AdminListChaptersView(generics.ListCreateAPIView):
    serializer_class = AdminChapterSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        qs = Chapter.objects.all().select_related("course")
        course_id = self.request.query_params.get("course_id")
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs.order_by("course_id", "order_index")

class AdminManageChapterView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chapter.objects.select_related("course").all()
    serializer_class = AdminChapterSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "chapter_id"
