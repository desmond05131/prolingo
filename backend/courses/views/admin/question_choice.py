from rest_framework import generics, permissions
from courses.models import QuestionChoice
from courses.serializers.admin.question_choice import AdminQuestionChoiceSerializer
from users.permissions import IsAdminRole


class AdminListQuestionChoicesView(generics.ListCreateAPIView):
    serializer_class = AdminQuestionChoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        qs = QuestionChoice.objects.all().select_related(
            "question",
            "question__test",
            "question__test__chapter",
            "question__test__chapter__course",
        )
        question_id = self.request.query_params.get("question_id")
        if question_id:
            qs = qs.filter(question_id=question_id)
        return qs.order_by("question_id", "order_index")


class AdminManageQuestionChoiceView(generics.RetrieveUpdateDestroyAPIView):
    queryset = QuestionChoice.objects.select_related(
        "question",
        "question__test",
        "question__test__chapter",
        "question__test__chapter__course",
    ).all()
    serializer_class = AdminQuestionChoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "choice_id"
