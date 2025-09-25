from rest_framework import generics, permissions
from courses.models import Course
from courses.serializers.client.course import ClientCourseSerializer

class ClientListCoursesView(generics.ListAPIView):
    serializer_class = ClientCourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only expose active courses to clients
        return Course.objects.filter(status=Course.Status.ACTIVE).order_by("course_id")

class ClientRetrieveCourseView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(status=Course.Status.ACTIVE)
    serializer_class = ClientCourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "course_id"
