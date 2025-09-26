from django.urls import path
from courses.views.client.question import ClientListQuestionsView, ClientRetrieveQuestionView

urlpatterns = [
    path("questions/", ClientListQuestionsView.as_view(), name="client_question_list"),
    path("questions/<int:question_id>", ClientRetrieveQuestionView.as_view(), name="client_question_detail"),
]

__all__ = ["urlpatterns"]
