from rest_framework import generics, permissions
from courses.models import UserCourse
from courses.serializers.client.user_course import ClientUserCourseSerializer


class ClientListUserCoursesView(generics.ListAPIView):
    serializer_class = ClientUserCourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = UserCourse.objects.filter(user=self.request.user).select_related("course")
        course_id = self.request.query_params.get("course_id")
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs.order_by("-user_course_id")


class ClientRetrieveUserCourseView(generics.RetrieveAPIView):
    serializer_class = ClientUserCourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "user_course_id"

    def get_queryset(self):
        return UserCourse.objects.filter(user=self.request.user).select_related("course")
