from rest_framework import generics, permissions, status
from rest_framework.response import Response

from courses.serializers.client.submit_user_test import SubmitUserTestSerializer
from courses.services.user_test_submission import submit_user_test, SubmissionAnswer


class ClientSubmitUserTestView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubmitUserTestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        # Convert answers into dataclass inputs
        answers = [
            SubmissionAnswer(question_id=a.get("question_id"), answer_text=a.get("answer_text") or "")
            for a in data.get("answers", [])
        ]
        result = submit_user_test(
            user=request.user,
            test_id=data["test_id"],
            duration=data["duration"],
            answers=answers,
        )

        response_payload = {
            "user_test_id": result.user_test.user_test_id,
            "attempt_date": result.user_test.attempt_date,
            "time_spent": result.user_test.time_spent,
            "total_questions": result.total_questions,
            "answered_count": result.answered_count,
            "correct_count": result.correct_count,
            "xp_awarded": result.xp_awarded,
            "energy_spent": result.energy_spent,
            "streak_created": result.streak_created,
        }
        headers = self.get_success_headers(response_payload)
        return Response(response_payload, status=status.HTTP_201_CREATED, headers=headers)
