from rest_framework import generics, permissions
from courses.models import UserTestAnswer
from courses.serializers.admin.user_test_answer import AdminUserTestAnswerSerializer
from users.permissions import IsAdminRole


class AdminListUserTestAnswersView(generics.ListCreateAPIView):
    serializer_class = AdminUserTestAnswerSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        qs = UserTestAnswer.objects.all().select_related(
            "user_test",
            "user_test__user",
            "user_test__test",
            "user_test__test__chapter",
            "user_test__test__chapter__course",
        )
        user_test_id = self.request.query_params.get("user_test_id")
        if user_test_id:
            qs = qs.filter(user_test_id=user_test_id)
        return qs.order_by("-user_test_answer_id")


class AdminManageUserTestAnswerView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserTestAnswer.objects.select_related(
        "user_test",
        "user_test__user",
        "user_test__test",
        "user_test__test__chapter",
        "user_test__test__chapter__course",
    ).all()
    serializer_class = AdminUserTestAnswerSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "user_test_answer_id"
