from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from courses.models import UserCourse
from courses.serializers.client.user_course import ClientUserCourseSerializer
from courses.models import Course


class ClientListUserCoursesView(generics.ListCreateAPIView):
    serializer_class = ClientUserCourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = UserCourse.objects.filter(user=self.request.user, is_dropped=False).select_related("course")
        course_id = self.request.query_params.get("course_id")
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs.order_by("-user_course_id")


class ClientEnrollCourseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Enroll the authenticated user into the given course.

        Body: { "course_id": int }
        Behavior:
        - If enrollment exists and is dropped => reactivate (is_dropped=False)
        - If enrollment exists and active => return existing
        - If not exists => create
        """
        course_id = request.data.get("course_id")
        if not course_id:
            return Response({"detail": "course_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Course.objects.get(pk=course_id)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        enrollment, created = UserCourse.objects.get_or_create(user=request.user, course=course)
        if enrollment.is_dropped:
            enrollment.is_dropped = False
            enrollment.save(update_fields=["is_dropped"])

        serializer = ClientUserCourseSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClientUnenrollCourseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_course_id: int):
        """Unenroll (soft-delete) the user from a course by marking is_dropped=True."""
        try:
            enrollment = (
                UserCourse.objects.select_related("course")
                .get(user_course_id=user_course_id, user=request.user)
            )
        except UserCourse.DoesNotExist:
            return Response({"detail": "Enrollment not found"}, status=status.HTTP_404_NOT_FOUND)

        if not enrollment.is_dropped:
            enrollment.is_dropped = True
            enrollment.save(update_fields=["is_dropped"])

        serializer = ClientUserCourseSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)
