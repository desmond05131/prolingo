from rest_framework import generics, permissions, response
from users.permissions import IsAdminRole
from courses.models import Course
from courses.serializers.admin.composed.tests_tree import AdminTestsFlatItemSerializer

class AdminTestsTreeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request, *args, **kwargs):
        # Include all courses, even if they lack chapters or tests, flattened
        courses_qs = (
            Course.objects.all()
            .prefetch_related(
                "chapters__tests",
            )
            .order_by("course_id")
        )

        flat_items = []
        for course in courses_qs:
            chapters = list(course.chapters.all().order_by("order_index", "chapter_id"))
            if not chapters:
                flat_items.append({
                    "course": course,
                    "chapter": None,
                    "test": None,
                })
                continue

            for chapter in chapters:
                tests = list(chapter.tests.all().order_by("order_index", "test_id"))
                if not tests:
                    flat_items.append({
                        "course": course,
                        "chapter": chapter,
                        "test": None,
                    })
                    continue
                for test in tests:
                    flat_items.append({
                        "course": course,
                        "chapter": chapter,
                        "test": test,
                    })

        ser = AdminTestsFlatItemSerializer(flat_items, many=True)
        return response.Response(ser.data)
