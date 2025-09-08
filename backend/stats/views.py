from rest_framework import generics, permissions
from .models import Stats
from .serializers import StatsSerializer


class StatsDetailView(generics.RetrieveAPIView):
	queryset = Stats.objects.all()
	serializer_class = StatsSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_object(self):
		pk = self.kwargs.get("pk")
		if pk is not None:
			return super().get_object()

		return self.request.user.stats

class StatsUpdateView(generics.UpdateAPIView):
	queryset = Stats.objects.all()
	serializer_class = StatsSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_object(self):
		pk = self.kwargs.get("pk")
		if pk is not None:
			return super().get_object()

		return self.request.user.stats
