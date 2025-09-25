from rest_framework import generics, permissions
from feedback.models import Feedback
from feedback.serializers.admin import AdminFeedbackSerializer
from users.permissions import IsAdminRole


class AdminListFeedbackView(generics.ListCreateAPIView):
    queryset = Feedback.objects.select_related("created_by", "updated_by").all()
    serializer_class = AdminFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]


class AdminManageFeedbackView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feedback.objects.select_related("created_by", "updated_by").all()
    serializer_class = AdminFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "feedback_id"

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
