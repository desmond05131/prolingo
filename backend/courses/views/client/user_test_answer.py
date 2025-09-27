from rest_framework import generics, permissions
from courses.models import UserTestAnswer
from courses.serializers.client.user_test_answer import ClientUserTestAnswerSerializer


class ClientListUserTestAnswersView(generics.ListAPIView):
    serializer_class = ClientUserTestAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = UserTestAnswer.objects.select_related(
            "user_test",
            "user_test__user",
            "user_test__test",
            "user_test__test__chapter",
            "user_test__test__chapter__course",
        ).filter(user_test__user=self.request.user)
        user_test_id = self.request.query_params.get("user_test_id")
        if user_test_id:
            qs = qs.filter(user_test_id=user_test_id)
        return qs.order_by("-user_test_answer_id")


class ClientRetrieveUserTestAnswerView(generics.RetrieveAPIView):
    serializer_class = ClientUserTestAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "user_test_answer_id"

    def get_queryset(self):
        return UserTestAnswer.objects.select_related(
            "user_test",
            "user_test__user",
            "user_test__test",
            "user_test__test__chapter",
            "user_test__test__chapter__course",
        ).filter(user_test__user=self.request.user)
