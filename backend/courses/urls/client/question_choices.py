from django.urls import path
from courses.views.client.question_choice import ClientListQuestionChoicesView, ClientRetrieveQuestionChoiceView

urlpatterns = [
    path("question-choices/", ClientListQuestionChoicesView.as_view(), name="client_question_choice_list"),
    path("question-choices/<int:choice_id>", ClientRetrieveQuestionChoiceView.as_view(), name="client_question_choice_detail"),
]

__all__ = ["urlpatterns"]
