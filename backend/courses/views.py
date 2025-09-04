from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.db.models import QuerySet

from .models import Course, Chapter, Test, Question, Option, UserTestResult
from .serializers import (
    CourseSerializer, ChapterSerializer, TestSerializer,
    QuestionSerializer, OptionSerializer, UserTestResultSerializer
)


class IsAdminRole(BasePermission):
    def has_permission(self, request, _):
        return bool(
            request.user and request.user.is_authenticated and (getattr(request.user, "role", None) == "admin" or getattr(request.user, "role", None) == "educator")
        )


class CreateCourseView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    # def get_permissions(self):
    #     if self.request.method == "POST":
    #         return [IsAuthenticated()]
    #     return [AllowAny()]


class ListCoursesView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    

class ManageCourseView(generics.RetrieveUpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
class DeleteCourseView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]


class CreateChapterView(viewsets.ModelViewSet):
    serializer_class = ChapterSerializer
    permission_classes = [AllowAny]
    queryset = Chapter.objects.select_related("course").all()

    def get_queryset(self):
        qs = super().get_queryset()
        course_id = self.request.query_params.get("course")
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs

class ListChaptersView(generics.ListAPIView):
    queryset = Chapter.objects.select_related("course").all()
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
class ManageChapterView(generics.RetrieveUpdateAPIView):
    queryset = Chapter.objects.select_related("course").all()
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
class DeleteChapterView(generics.DestroyAPIView):
    queryset = Chapter.objects.select_related("course").all()
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

class CreateTestView(viewsets.ModelViewSet):
    serializer_class = TestSerializer
    permission_classes = [AllowAny]
    queryset = Test.objects.select_related("chapter", "chapter__course").all()

    def get_queryset(self):
        qs = super().get_queryset()
        chapter_id = self.request.query_params.get("chapter")
        if chapter_id:
            qs = qs.filter(chapter_id=chapter_id)
        return qs
    
class ListTestsView(generics.ListAPIView):
    queryset = Test.objects.select_related("chapter", "chapter__course").all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
class ManageTestView(generics.RetrieveUpdateAPIView):
    queryset = Test.objects.select_related("chapter", "chapter__course").all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
class DeleteTestView(generics.DestroyAPIView):
    queryset = Test.objects.select_related("chapter", "chapter__course").all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

class CreateQuestionView(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]
    queryset = Question.objects.select_related("test", "test__chapter").all()

    def get_queryset(self):
        qs = super().get_queryset()
        test_id = self.request.query_params.get("test")
        if test_id:
            qs = qs.filter(test_id=test_id)
        return qs
    
class ListQuestionsView(generics.ListAPIView):
    queryset = Question.objects.select_related("test", "test__chapter").all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
class ManageQuestionView(generics.RetrieveUpdateAPIView):
    queryset = Question.objects.select_related("test", "test__chapter").all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
class DeleteQuestionView(generics.DestroyAPIView):
    queryset = Question.objects.select_related("test", "test__chapter").all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

class CreateOptionView(viewsets.ModelViewSet):
    serializer_class = OptionSerializer
    permission_classes = [AllowAny]
    queryset = Option.objects.select_related("question", "question__test").all()
    
class ListOptionsView(generics.ListAPIView):
    queryset = Option.objects.select_related("question", "question__test").all()
    serializer_class = OptionSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
class ManageOptionView(generics.RetrieveUpdateAPIView):
    queryset = Option.objects.select_related("question", "question__test").all()
    serializer_class = OptionSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
class DeleteOptionView(generics.DestroyAPIView):
    queryset = Option.objects.select_related("question", "question__test").all()
    serializer_class = OptionSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

class CreateUserTestResultView(viewsets.ModelViewSet):
    serializer_class = UserTestResultSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        qs = UserTestResult.objects.select_related("user", "test", "test__chapter")
        # Users see their own results; staff can see all or filter by user
        user = self.request.user
        if getattr(user, "is_staff", False) and (u := self.request.query_params.get("user")):
            return qs.filter(user_id=u)
        if getattr(user, "is_authenticated", False):
            return qs.filter(user=user)
        return qs.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        qs = UserTestResult.objects.select_related("user", "test", "test__chapter")
        # Users see their own results; staff can see all or filter by user
        if self.request.user.is_staff and (u := self.request.query_params.get("user")):
            return qs.filter(user_id=u)
        return qs.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class ListUserTestResultsView(generics.ListAPIView):
    serializer_class = UserTestResultSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        qs = UserTestResult.objects.select_related("user", "test", "test__chapter")
        user_id = self.request.query_params.get("user")
        if user_id:
            qs = qs.filter(user_id=user_id)
        return qs
    
class ManageUserTestResultView(generics.RetrieveUpdateAPIView):
    queryset = UserTestResult.objects.select_related("user", "test", "test__chapter").all()
    serializer_class = UserTestResultSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
class DeleteUserTestResultView(generics.DestroyAPIView):
    queryset = UserTestResult.objects.select_related("user", "test", "test__chapter").all()
    serializer_class = UserTestResultSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    
