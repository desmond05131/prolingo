"""Aggregated client URL patterns for courses app."""
from .courses import urlpatterns as course_urlpatterns
from .chapters import urlpatterns as chapter_urlpatterns
from .tests import urlpatterns as test_urlpatterns
from .tests_tree import urlpatterns as test_tree_urlpatterns
from .questions import urlpatterns as question_urlpatterns
from .question_choices import urlpatterns as question_choice_urlpatterns
from .user_courses import urlpatterns as user_course_urlpatterns
from .user_tests import urlpatterns as user_test_urlpatterns
from .user_test_answers import urlpatterns as user_test_answer_urlpatterns
from .user_test_submissions import urlpatterns as user_test_submission_urlpatterns

urlpatterns = (
	course_urlpatterns
	+ chapter_urlpatterns
	+ test_urlpatterns
	+ test_tree_urlpatterns
	+ question_urlpatterns
	+ question_choice_urlpatterns
	+ user_course_urlpatterns
	+ user_test_urlpatterns
	+ user_test_answer_urlpatterns
	+ user_test_submission_urlpatterns
)

__all__ = ["urlpatterns"]
