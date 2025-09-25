from rest_framework import generics, permissions
from courses.models import UserTest
from courses.serializers.client.user_test import ClientUserTestSerializer


class ClientListUserTestsView(generics.ListAPIView):
    serializer_class = ClientUserTestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = UserTest.objects.filter(user=self.request.user).select_related(
            "test",
            "test__chapter",
            "test__chapter__course",
        )
        test_id = self.request.query_params.get("test_id")
        if test_id:
            qs = qs.filter(test_id=test_id)
        return qs.order_by("-user_test_id")


class ClientRetrieveUserTestView(generics.RetrieveAPIView):
    serializer_class = ClientUserTestSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "user_test_id"

    def get_queryset(self):
        return UserTest.objects.filter(user=self.request.user).select_related(
            "test",
            "test__chapter",
            "test__chapter__course",
        )
