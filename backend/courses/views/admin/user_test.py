from rest_framework import generics, permissions
from courses.models import UserTest
from courses.serializers.admin.user_test import AdminUserTestSerializer
from users.permissions import IsAdminRole


class AdminListUserTestsView(generics.ListCreateAPIView):
    serializer_class = AdminUserTestSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        qs = UserTest.objects.all().select_related("user", "test", "test__chapter", "test__chapter__course")
        user_id = self.request.query_params.get("user_id")
        test_id = self.request.query_params.get("test_id")
        if user_id:
            qs = qs.filter(user_id=user_id)
        if test_id:
            qs = qs.filter(test_id=test_id)
        return qs.order_by("-user_test_id")


class AdminManageUserTestView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserTest.objects.select_related("user", "test", "test__chapter", "test__chapter__course").all()
    serializer_class = AdminUserTestSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "user_test_id"
