from rest_framework import generics, permissions
from courses.models import Question
from courses.serializers.admin.question import AdminQuestionSerializer
from users.permissions import IsAdminRole

class AdminListQuestionsView(generics.ListCreateAPIView):
    serializer_class = AdminQuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        qs = Question.objects.all().select_related("test", "test__chapter", "test__chapter__course")
        test_id = self.request.query_params.get("test_id")
        if test_id:
            qs = qs.filter(test_id=test_id)
        return qs.order_by("test_id", "order_index")

class AdminManageQuestionView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.select_related("test", "test__chapter", "test__chapter__course").all()
    serializer_class = AdminQuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "question_id"
