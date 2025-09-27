from __future__ import annotations

from rest_framework import serializers
 


class SubmissionAnswerInputSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer_text = serializers.CharField(allow_blank=True, allow_null=True, required=False)


class SubmitUserTestSerializer(serializers.Serializer):
    test_id = serializers.IntegerField()
    duration = serializers.IntegerField(min_value=0)
    answers = SubmissionAnswerInputSerializer(many=True)

    # Response fields
    user_test_id = serializers.IntegerField(read_only=True)
    attempt_date = serializers.DateTimeField(read_only=True)
    time_spent = serializers.IntegerField(read_only=True)

    total_questions = serializers.IntegerField(read_only=True)
    answered_count = serializers.IntegerField(read_only=True)
    correct_count = serializers.IntegerField(read_only=True)
    xp_awarded = serializers.IntegerField(read_only=True)
    energy_spent = serializers.IntegerField(read_only=True)
    streak_created = serializers.BooleanField(read_only=True)

    def create(self, validated_data):
        # This serializer is used as an I/O contract; creation is handled in the view via service
        raise NotImplementedError("Use view to handle creation via service")

    def update(self, instance, validated_data):
        raise NotImplementedError()
