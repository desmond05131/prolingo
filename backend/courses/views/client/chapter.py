from rest_framework import generics, permissions
from courses.models import Chapter
from courses.serializers.client.chapter import ClientChapterSerializer

class ClientListChaptersView(generics.ListAPIView):
    serializer_class = ClientChapterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Chapter.objects.all().select_related("course")
        course_id = self.request.query_params.get("course_id")
        if course_id:
            qs = qs.filter(course_id=course_id)
        # Only show chapters belonging to active courses
        return qs.filter(course__status="active").order_by("course_id", "order_index")

class ClientRetrieveChapterView(generics.RetrieveAPIView):
    queryset = Chapter.objects.select_related("course").filter(course__status="active")
    serializer_class = ClientChapterSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "chapter_id"
