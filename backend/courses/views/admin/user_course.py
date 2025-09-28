from rest_framework import generics, permissions
from courses.models import UserCourse
from courses.serializers.admin.user_course import AdminUserCourseSerializer
from users.permissions import IsAdminRole


class AdminListUserCoursesView(generics.ListCreateAPIView):
    serializer_class = AdminUserCourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        qs = UserCourse.objects.all().select_related("user", "course")
        user_id = self.request.query_params.get("user_id")
        course_id = self.request.query_params.get("course_id")
        if user_id:
            qs = qs.filter(user_id=user_id)
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs.order_by("-user_course_id")


class AdminManageUserCourseView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserCourse.objects.select_related("user", "course").all()
    serializer_class = AdminUserCourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "user_course_id"
