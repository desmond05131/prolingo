from django.urls import path
from . import views

urlpatterns = [
    # Feedback
    path("feedback/", views.CreateFeedbackView.as_view(), name="create_feedback"),
    path("feedback/mine/", views.UserFeedbackListView.as_view(), name="my_feedback"),
    path("feedback/all/", views.AdminFeedbackListView.as_view(), name="all_feedback"),
    path("feedback/<int:pk>/", views.FeedbackDetailView.as_view(), name="feedback_detail"),

    # Responses
    path("feedback/<int:feedback_id>/responses/", views.ResponseListByFeedbackView.as_view(), name="responses_by_feedback"),
    path("responses/", views.CreateResponseView.as_view(), name="create_response"),
    path("responses/<int:pk>/", views.ResponseDetailView.as_view(), name="response_detail"),

    # Admin actions (audit)
    path("admin-actions/", views.LogAdminActionView.as_view(), name="log_admin_action"),
    path("admin-actions/list/", views.AdminActionsListView.as_view(), name="admin_actions_list"),
    path("admin-actions/<int:pk>/", views.AdminActionDeleteView.as_view(), name="admin_action_delete"),
]