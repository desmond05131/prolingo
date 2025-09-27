from rest_framework import generics, permissions
from courses.models import QuestionChoice
from courses.serializers.client.question_choice import ClientQuestionChoiceSerializer

class ClientListQuestionChoicesView(generics.ListAPIView):
    serializer_class = ClientQuestionChoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = QuestionChoice.objects.all().select_related("question", "question__test", "question__test__chapter", "question__test__chapter__course")
        question_id = self.request.query_params.get("question_id")
        if question_id:
            qs = qs.filter(question_id=question_id)
        return qs.filter(question__test__chapter__course__status="active").order_by("question_id", "order_index")

class ClientRetrieveQuestionChoiceView(generics.RetrieveAPIView):
    queryset = QuestionChoice.objects.select_related("question", "question__test", "question__test__chapter", "question__test__chapter__course").filter(question__test__chapter__course__status="active")
    serializer_class = ClientQuestionChoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "choice_id"
