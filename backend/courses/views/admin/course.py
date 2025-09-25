from rest_framework import generics, permissions
from courses.models import Course
from courses.serializers.admin.course import AdminCourseSerializer
from users.permissions import IsAdminRole

class AdminListCoursesView(generics.ListCreateAPIView):
    queryset = Course.objects.all().order_by("course_id")
    serializer_class = AdminCourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user, updated_by=user)

class AdminManageCourseView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = AdminCourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "course_id"

    def perform_update(self, serializer):
        serializer.instance.updated_by = self.request.user
        serializer.save()
