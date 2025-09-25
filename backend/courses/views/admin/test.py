from rest_framework import generics, permissions
from courses.models import Test
from courses.serializers.admin.test import AdminTestSerializer
from users.permissions import IsAdminRole

class AdminListTestsView(generics.ListCreateAPIView):
    serializer_class = AdminTestSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        qs = Test.objects.all().select_related("chapter", "chapter__course")
        chapter_id = self.request.query_params.get("chapter_id")
        if chapter_id:
            qs = qs.filter(chapter_id=chapter_id)
        return qs.order_by("chapter_id", "order_index")

class AdminManageTestView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Test.objects.select_related("chapter", "chapter__course").all()
    serializer_class = AdminTestSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    lookup_field = "test_id"
