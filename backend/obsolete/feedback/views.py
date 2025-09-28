from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone

from .models import Feedback, AdminFeedbackResponse, AdminAction
from .serializers import FeedbackSerializer, AdminFeedbackResponseSerializer, AdminActionSerializer
from users.permissions import IsAdminRole, IsOwnerOrAdmin

# Feedback endpoints
class CreateFeedbackView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserFeedbackListView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Feedback.objects.filter(user=self.request.user)

class AdminFeedbackListView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    queryset = Feedback.objects.all().order_by("-submitted_date")

class FeedbackDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    queryset = Feedback.objects.all()

# Admin responses
class CreateResponseView(generics.CreateAPIView):
    serializer_class = AdminFeedbackResponseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)

class ResponseListByFeedbackView(generics.ListAPIView):
    serializer_class = AdminFeedbackResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        feedback_id = self.kwargs.get("feedback_id")
        feedback = get_object_or_404(Feedback, pk=feedback_id)
        # owners and admins can view responses
        if feedback.user == self.request.user or getattr(self.request.user, "role", None) == "admin" or self.request.user.is_staff:
            return AdminFeedbackResponse.objects.filter(feedback=feedback).order_by("-response_date")
        return AdminFeedbackResponse.objects.none()

class ResponseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdminFeedbackResponseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    queryset = AdminFeedbackResponse.objects.all()

# Admin actions (audit)
class LogAdminActionView(generics.CreateAPIView):
    serializer_class = AdminActionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)

class AdminActionsListView(generics.ListAPIView):
    serializer_class = AdminActionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # admins see their own logs; super admin/staff can see all
        if getattr(self.request.user, "role", None) == "admin" or self.request.user.is_staff:
            admin_id = self.request.query_params.get("admin_id")
            qs = AdminAction.objects.all().order_by("-action_date")
            if admin_id:
                qs = qs.filter(admin_id=admin_id)
            # limit: if not staff, restrict to own logs
            if not self.request.user.is_staff:
                qs = qs.filter(admin=self.request.user)
            return qs
        return AdminAction.objects.none()

class AdminActionDeleteView(generics.DestroyAPIView):
    serializer_class = AdminActionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    queryset = AdminAction.objects.all()

# helper function you can call from other code to log actions
def log_admin_action(admin_user, action_type, target_id=None, details=""):
    AdminAction.objects.create(admin=admin_user, action_type=action_type, target_id=str(target_id or ""), details=details)