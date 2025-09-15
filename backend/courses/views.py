from rest_framework import viewsets, generics, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import models
from .models import (
    Course, Chapter, Test, Question, Option,
    UserCourse, UserChapter, UserTestResult, UserAnswer
)
from .serializers import (
    CourseSerializer, ChapterSerializer, TestSerializer, QuestionSerializer, OptionSerializer,
    UserCourseSerializer, UserChapterSerializer, UserTestResultSerializer, UserAnswerSerializer
)
from users.views import IsAdminRole  # if present, else import/create similar permission
from users.models import User
from django.db.models import Q

def get_queryset(self):
    qs = super().get_queryset()
    # anonymous users => only active courses
    if not getattr(self.request.user, "is_authenticated", False):
        return qs.filter(status='active')
    # admin/staff => all
    if getattr(self.request.user, "role", None) == 'admin' or self.request.user.is_staff:
        return qs
    # normal user => active plus own drafts
    return qs.filter(Q(status='active') | Q(created_by=self.request.user))

class IsOwnerOrAdmin(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if getattr(request.user, 'role', None) == 'admin' or request.user.is_staff:
            return True
        # Courses: owner check
        if isinstance(obj, Course):
            return obj.created_by == request.user
        # fallback
        return getattr(obj, 'user', None) == request.user

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('-created_date')
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        # anonymous users => only active courses
        if not getattr(self.request.user, "is_authenticated", False):
            return qs.filter(status='active')
        # admins/staff see all
        if getattr(self.request.user, 'role', None) == 'admin' or self.request.user.is_staff:
            return qs
        # authenticated non-admins see active and drafts they created
        return qs.filter(models.Q(status='active') | models.Q(created_by=self.request.user))

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        qs = super().get_queryset()
        if course_id:
            qs = qs.filter(course_id=course_id).order_by('order_index')
        return qs

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        chapter_id = self.request.query_params.get('chapter_id')
        qs = super().get_queryset()
        if chapter_id:
            qs = qs.filter(chapter_id=chapter_id)
        return qs

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        test_id = self.request.query_params.get('test_id')
        qs = super().get_queryset()
        if test_id:
            qs = qs.filter(test_id=test_id)
        return qs

class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        question_id = self.request.query_params.get('question_id')
        qs = super().get_queryset()
        if question_id:
            qs = qs.filter(question_id=question_id)
        return qs

# Enrollment & progress views
class EnrollView(generics.CreateAPIView):
    serializer_class = UserCourseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        course_id = self.request.data.get('course')
        course = get_object_or_404(Course, id=course_id)
        serializer.save(user=self.request.user, course=course)

class UserCoursesList(generics.ListAPIView):
    serializer_class = UserCourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserCourse.objects.filter(user=self.request.user).select_related('course')

class UpdateUserCourse(generics.RetrieveUpdateAPIView):
    serializer_class = UserCourseSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        course_id = self.kwargs.get('pk')
        return get_object_or_404(UserCourse, pk=course_id, user=self.request.user)

class UnenrollView(generics.DestroyAPIView):
    serializer_class = UserCourseSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        course_id = self.kwargs.get('pk')
        return get_object_or_404(UserCourse, pk=course_id, user=self.request.user)

# UserChapter management
class UserChapterView(generics.RetrieveUpdateAPIView):
    serializer_class = UserChapterSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        chapter_id = self.kwargs.get('chapter_id')
        chapter = get_object_or_404(Chapter, pk=chapter_id)
        obj, _ = UserChapter.objects.get_or_create(user=user, chapter=chapter)
        return obj

# Test results & answers
class UserTestResultViewSet(viewsets.ModelViewSet):
    queryset = UserTestResult.objects.all().order_by('-attempt_date')
    serializer_class = UserTestResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        test_id = self.request.query_params.get('test_id')
        if user_id:
            qs = qs.filter(user_id=user_id)
        if test_id:
            qs = qs.filter(test_id=test_id)
        # normal users only see own results
        if self.request.user.role != 'admin' and not self.request.user.is_staff:
            qs = qs.filter(user=self.request.user)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserAnswerViewSet(viewsets.ModelViewSet):
    queryset = UserAnswer.objects.all()
    serializer_class = UserAnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        result_id = self.request.query_params.get('result_id')
        if result_id:
            qs = qs.filter(result_id=result_id)
        # restrict to owner unless admin
        if self.request.user.role != 'admin' and not self.request.user.is_staff:
            qs = qs.filter(result__user=self.request.user)
        return qs

# small helper endpoint to mark chapter complete and update progress_percent
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_chapter_complete(request, chapter_id):
    user = request.user
    chapter = get_object_or_404(Chapter, pk=chapter_id)
    uc, _ = UserChapter.objects.get_or_create(user=user, chapter=chapter)
    uc.completed = True
    uc.last_accessed = timezone.now()
    uc.save()

    # update UserCourse progress_percent if enrolled
    try:
        uc_course = UserCourse.objects.get(user=user, course=chapter.course)
        total = chapter.course.chapters.count() or 1
        completed = UserChapter.objects.filter(user=user, chapter__course=chapter.course, completed=True).count()
        uc_course.progress_percent = round((completed / total) * 100, 2)
        if uc_course.progress_percent >= 100:
            uc_course.status = 'completed'
        uc_course.save()
    except UserCourse.DoesNotExist:
        pass

    return Response({'success': True, 'progress_percent': getattr(uc_course, 'progress_percent', None)})