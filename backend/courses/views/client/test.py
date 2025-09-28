from rest_framework import generics, permissions
from courses.models import Test
from courses.serializers.client.test import ClientTestSerializer

class ClientListTestsView(generics.ListAPIView):
    serializer_class = ClientTestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Test.objects.all().select_related("chapter", "chapter__course")
        chapter_id = self.request.query_params.get("chapter_id")
        if chapter_id:
            qs = qs.filter(chapter_id=chapter_id)
        return qs.filter(chapter__course__status="active").order_by("chapter_id", "order_index")

class ClientRetrieveTestView(generics.RetrieveAPIView):
    queryset = Test.objects.select_related("chapter", "chapter__course").filter(chapter__course__status="active")
    serializer_class = ClientTestSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "test_id"
