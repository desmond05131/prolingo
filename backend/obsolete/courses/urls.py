from django.urls import path
from . import views

urlpatterns = [
    # Course CRUD
    path("courses/", views.CourseListView.as_view(), name="course-list"),
    path("courses/create/", views.CourseCreateView.as_view(), name="course-create"),
    path("courses/<int:pk>/", views.CourseDetailView.as_view(), name="course-detail"),
    path("courses/<int:pk>/update/", views.CourseUpdateView.as_view(), name="course-update"),
    path("courses/<int:pk>/delete/", views.CourseDeleteView.as_view(), name="course-delete"),

    # Chapter CRUD
    path("chapters/", views.ChapterListView.as_view(), name="chapter-list"),
    path("chapters/create/", views.ChapterCreateView.as_view(), name="chapter-create"),
    path("chapters/<int:pk>/", views.ChapterDetailView.as_view(), name="chapter-detail"),
    path("chapters/<int:pk>/update/", views.ChapterUpdateView.as_view(), name="chapter-update"),
    path("chapters/<int:pk>/delete/", views.ChapterDeleteView.as_view(), name="chapter-delete"),

    # Test CRUD
    path("tests/", views.TestListView.as_view(), name="test-list"),
    path("tests/create/", views.TestCreateView.as_view(), name="test-create"),
    path("tests/<int:pk>/", views.TestDetailView.as_view(), name="test-detail"),
    path("tests/<int:pk>/update/", views.TestUpdateView.as_view(), name="test-update"),
    path("tests/<int:pk>/delete/", views.TestDeleteView.as_view(), name="test-delete"),

    # Question CRUD
    path("questions/", views.QuestionListView.as_view(), name="question-list"),
    path("questions/create/", views.QuestionCreateView.as_view(), name="question-create"),
    path("questions/<int:pk>/", views.QuestionDetailView.as_view(), name="question-detail"),
    path("questions/<int:pk>/update/", views.QuestionUpdateView.as_view(), name="question-update"),
    path("questions/<int:pk>/delete/", views.QuestionDeleteView.as_view(), name="question-delete"),

    # Option CRUD
    path("options/", views.OptionListView.as_view(), name="option-list"),
    path("options/create/", views.OptionCreateView.as_view(), name="option-create"),
    path("options/<int:pk>/", views.OptionDetailView.as_view(), name="option-detail"),
    path("options/<int:pk>/update/", views.OptionUpdateView.as_view(), name="option-update"),
    path("options/<int:pk>/delete/", views.OptionDeleteView.as_view(), name="option-delete"),

    # Enrollment & Progress
    path("enroll/", views.EnrollView.as_view(), name="enroll"),
    path("my-courses/", views.UserCoursesListView.as_view(), name="my-courses"),
    path("my-courses/<int:pk>/", views.UserCourseDetailView.as_view(), name="my-course-detail"),
    path("my-courses/<int:pk>/update/", views.UserCourseUpdateView.as_view(), name="my-course-update"),
    path("my-courses/<int:pk>/unenroll/", views.UnenrollView.as_view(), name="unenroll"),

    # User Chapter Progress
    path("user-chapters/<int:chapter_id>/", views.UserChapterDetailView.as_view(), name="user-chapter-detail"),
    path("user-chapters/<int:chapter_id>/update/", views.UserChapterUpdateView.as_view(), name="user-chapter-update"),
    path("chapters/<int:chapter_id>/complete/", views.mark_chapter_complete, name="mark-chapter-complete"),

    # Test Results
    path("test-results/", views.UserTestResultListView.as_view(), name="test-results-list"),
    path("test-results/create/", views.UserTestResultCreateView.as_view(), name="test-results-create"),
    path("test-results/<int:pk>/", views.UserTestResultDetailView.as_view(), name="test-results-detail"),
    path("test-results/<int:pk>/update/", views.UserTestResultUpdateView.as_view(), name="test-results-update"),
    path("test-results/<int:pk>/delete/", views.UserTestResultDeleteView.as_view(), name="test-results-delete"),

    # User Answers
    path("answers/", views.UserAnswerListView.as_view(), name="answers-list"),
    path("answers/create/", views.UserAnswerCreateView.as_view(), name="answers-create"),
    path("answers/<int:pk>/", views.UserAnswerDetailView.as_view(), name="answers-detail"),
    path("answers/<int:pk>/update/", views.UserAnswerUpdateView.as_view(), name="answers-update"),
    path("answers/<int:pk>/delete/", views.UserAnswerDeleteView.as_view(), name="answers-delete"),

    # Admin User Course Management
    path("admin/user-courses/", views.AdminUserCourseListView.as_view(), name="admin-user-courses-list"),
    path("admin/user-courses/create/", views.AdminUserCourseCreateView.as_view(), name="admin-user-courses-create"),
    path("admin/user-courses/<int:pk>/", views.AdminUserCourseDetailView.as_view(), name="admin-user-courses-detail"),
    path("admin/user-courses/<int:pk>/update/", views.AdminUserCourseUpdateView.as_view(), name="admin-user-courses-update"),
    path("admin/user-courses/<int:pk>/delete/", views.AdminUserCourseDeleteView.as_view(), name="admin-user-courses-delete"),

    # Admin User Chapter Management
    path("admin/user-chapters/", views.AdminUserChapterListView.as_view(), name="admin-user-chapters-list"),
    path("admin/user-chapters/create/", views.AdminUserChapterCreateView.as_view(), name="admin-user-chapters-create"),
    path("admin/user-chapters/<int:pk>/", views.AdminUserChapterDetailView.as_view(), name="admin-user-chapters-detail"),
    path("admin/user-chapters/<int:pk>/update/", views.AdminUserChapterUpdateView.as_view(), name="admin-user-chapters-update"),
    path("admin/user-chapters/<int:pk>/delete/", views.AdminUserChapterDeleteView.as_view(), name="admin-user-chapters-delete"),

    # Admin User Test Result Management
    path("admin/test-results/", views.AdminUserTestResultListView.as_view(), name="admin-test-results-list"),
    path("admin/test-results/create/", views.AdminUserTestResultCreateView.as_view(), name="admin-test-results-create"),
    path("admin/test-results/<int:pk>/", views.AdminUserTestResultDetailView.as_view(), name="admin-test-results-detail"),
    path("admin/test-results/<int:pk>/update/", views.AdminUserTestResultUpdateView.as_view(), name="admin-test-results-update"),
    path("admin/test-results/<int:pk>/delete/", views.AdminUserTestResultDeleteView.as_view(), name="admin-test-results-delete"),

    # Admin User Answer Management
    path("admin/user-answers/", views.AdminUserAnswerListView.as_view(), name="admin-user-answers-list"),
    path("admin/user-answers/create/", views.AdminUserAnswerCreateView.as_view(), name="admin-user-answers-create"),
    path("admin/user-answers/<int:pk>/", views.AdminUserAnswerDetailView.as_view(), name="admin-user-answers-detail"),
    path("admin/user-answers/<int:pk>/update/", views.AdminUserAnswerUpdateView.as_view(), name="admin-user-answers-update"),
    path("admin/user-answers/<int:pk>/delete/", views.AdminUserAnswerDeleteView.as_view(), name="admin-user-answers-delete"),
]