from django.urls import path
from courses.views.client.user_test_answer import (
    ClientListUserTestAnswersView,
    ClientRetrieveUserTestAnswerView,
)

urlpatterns = [
    path("user-test-answers/", ClientListUserTestAnswersView.as_view(), name="client_user_test_answer_list"),
    path(
        "user-test-answers/<int:user_test_answer_id>/",
        ClientRetrieveUserTestAnswerView.as_view(),
        name="client_user_test_answer_detail",
    ),
]

__all__ = ["urlpatterns"]
