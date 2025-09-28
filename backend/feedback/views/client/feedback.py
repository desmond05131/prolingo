from rest_framework import generics, permissions
from feedback.models import Feedback
from feedback.serializers.client import ClientFeedbackSerializer


class ClientListFeedbackView(generics.ListAPIView):
    serializer_class = ClientFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Feedback.objects.filter(created_by=self.request.user).order_by("-feedback_id")


class ClientCreateFeedbackView(generics.CreateAPIView):
    serializer_class = ClientFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
