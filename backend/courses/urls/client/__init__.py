"""Aggregated client URL patterns for courses app."""
from .courses import urlpatterns as course_urlpatterns
from .chapters import urlpatterns as chapter_urlpatterns
from .tests import urlpatterns as test_urlpatterns
from .questions import urlpatterns as question_urlpatterns
from .question_choices import urlpatterns as question_choice_urlpatterns

urlpatterns = course_urlpatterns + chapter_urlpatterns + test_urlpatterns + question_urlpatterns + question_choice_urlpatterns

__all__ = ["urlpatterns"]
