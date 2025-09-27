from django.urls import path
from courses.views.admin.user_test_answer import (
    AdminListUserTestAnswersView,
    AdminManageUserTestAnswerView,
)

urlpatterns = [
    path("user-test-answers/", AdminListUserTestAnswersView.as_view(), name="admin_user_test_answer_list"),
    path(
        "user-test-answers/<int:user_test_answer_id>",
        AdminManageUserTestAnswerView.as_view(),
        name="admin_user_test_answer_detail",
    ),
]

__all__ = ["urlpatterns"]
