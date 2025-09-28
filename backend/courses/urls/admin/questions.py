from django.urls import path
from courses.views.admin.question import AdminListQuestionsView, AdminManageQuestionView

urlpatterns = [
    path("questions/", AdminListQuestionsView.as_view(), name="admin_question_list"),
    path("questions/<int:question_id>", AdminManageQuestionView.as_view(), name="admin_question_detail"),
]

__all__ = ["urlpatterns"]
