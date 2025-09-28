from rest_framework import generics, permissions, status
from rest_framework.response import Response
from streaks.models import DailyStreak
from streaks.serializers.client.daily_streaks import ClientDailyStreakSerializer
from django.utils import timezone
from datetime import date
from calendar import monthrange
from common import get_streak_saver_limit_for_user
from streaks.utils import compute_current_streak

class ClientMyDailyStreaksView(generics.ListAPIView):
    serializer_class = ClientDailyStreakSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            DailyStreak.objects.filter(user=self.request.user)
            .only("daily_streak_date", "is_streak_saver")
            .order_by("-daily_streak_date")
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page if page is not None else queryset, many=True)
        data = serializer.data

        # Compute current streak ending today
        streak_count = compute_current_streak(request.user)

        # Compute usable streak saver left for this month
        today = timezone.now().date()
        year, month = today.year, today.month
        start_of_month = date(year, month, 1)
        end_of_month = date(year, month, monthrange(year, month)[1])
        used_streak_savers = (
            DailyStreak.objects.filter(
                user=request.user,
                is_streak_saver=True,
                daily_streak_date__gte=start_of_month,
                daily_streak_date__lte=end_of_month,
            ).count()
        )
        monthly_limit = get_streak_saver_limit_for_user(request.user)
        streak_saver_left_this_month = max(0, monthly_limit - used_streak_savers)

        payload = {
            "streak_count": streak_count,
            "streak_days": data,
            "streak_saver_left_this_month": streak_saver_left_this_month,
        }

        if page is not None:
            return self.get_paginated_response(payload)
        return Response(payload)

class ClientCreateTodayDailyStreakView(generics.CreateAPIView):
    serializer_class = ClientDailyStreakSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Enforce uniqueness at application level to provide clearer error than DB IntegrityError
        today = timezone.now().date()
        if DailyStreak.objects.filter(user=self.request.user, daily_streak_date=today).exists():
            # Simply return existing without creating new duplicate
            # Alternative: raise ValidationError
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"detail": "Today's streak already recorded"})
        serializer.save(user=self.request.user, daily_streak_date=today)


class ClientUseStreakSaverView(generics.CreateAPIView):
    """Allows a user to use a streak saver for a specific date.

    Rules:
    - Can only create a DailyStreak with is_streak_saver=True when there's no existing entry for that date.
    - Monthly usage per user is capped by STREAK_SAVER_MONTHLY_LIMIT.
    - If already reached the cap, returns 400 with a friendly message.
    - If a normal streak already exists for that date, returns 200 with the existing one (no change).
    - Body accepts optional { "date": "YYYY-MM-DD" }; defaults to today.
    """
    serializer_class = ClientDailyStreakSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Parse target date
        try:
            req_date_str = request.data.get("date")
        except Exception:
            req_date_str = None

        if req_date_str:
            try:
                target_date = date.fromisoformat(req_date_str)
            except ValueError:
                return Response({"detail": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            target_date = timezone.now().date()

        # If a streak already exists for that date, return it
        existing = DailyStreak.objects.filter(user=request.user, daily_streak_date=target_date).first()
        if existing:
            return Response(
                {"detail": "Invalid date to use streak saver (existing streak found)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check monthly usage of streak savers
        year, month = target_date.year, target_date.month
        start_of_month = date(year, month, 1)
        end_of_month = date(year, month, monthrange(year, month)[1])
        used_count = (
            DailyStreak.objects.filter(
                user=request.user,
                is_streak_saver=True,
                daily_streak_date__gte=start_of_month,
                daily_streak_date__lte=end_of_month,
            ).count()
        )
        limit = get_streak_saver_limit_for_user(request.user)
        if used_count >= limit:
            return Response(
                {"detail": f"Monthly streak saver limit reached ({limit})."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create a streak saver record for target date
        obj = DailyStreak.objects.create(
            user=request.user,
            daily_streak_date=target_date,
            is_streak_saver=True,
        )
        ser = ClientDailyStreakSerializer(obj)
        headers = self.get_success_headers(ser.data)
        return Response(ser.data, status=status.HTTP_201_CREATED, headers=headers)
