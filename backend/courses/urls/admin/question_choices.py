from django.urls import path
from courses.views.admin.question_choice import AdminListQuestionChoicesView, AdminManageQuestionChoiceView

urlpatterns = [
    path("question-choices/", AdminListQuestionChoicesView.as_view(), name="admin_question_choice_list"),
    path("question-choices/<int:choice_id>", AdminManageQuestionChoiceView.as_view(), name="admin_question_choice_detail"),
]

__all__ = ["urlpatterns"]
