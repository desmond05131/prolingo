from rest_framework import generics, permissions
from courses.models import Question
from courses.serializers.client.question import ClientQuestionSerializer

class ClientListQuestionsView(generics.ListAPIView):
    serializer_class = ClientQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Question.objects.all().select_related("test", "test__chapter", "test__chapter__course")
        test_id = self.request.query_params.get("test_id")
        if test_id:
            qs = qs.filter(test_id=test_id)
        return qs.filter(test__chapter__course__status="active").order_by("test_id", "order_index")

class ClientRetrieveQuestionView(generics.RetrieveAPIView):
    queryset = Question.objects.select_related("test", "test__chapter", "test__chapter__course").filter(test__chapter__course__status="active")
    serializer_class = ClientQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "question_id"
