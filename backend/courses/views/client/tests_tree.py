from rest_framework import generics, permissions, response
from courses.models import Course
from courses.serializers.client.composed.tests_tree import ClientTestsFlatItemSerializer

class ClientTestsTreeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Include courses without chapters and chapters without tests, flattened
        courses_qs = (
            Course.objects.filter(status=Course.Status.ACTIVE)
            .prefetch_related(
                # Prefetch chapters preserving ordering
                "chapters__tests",
            )
            .order_by("course_id")
        )

        flat_items = []
        for course in courses_qs:
            chapters = list(course.chapters.all().order_by("order_index", "chapter_id"))
            if not chapters:
                # Course without chapters
                flat_items.append({
                    "course": course,
                    "chapter": None,
                    "test": None,
                })
                continue

            for chapter in chapters:
                tests = list(chapter.tests.all().order_by("order_index", "test_id"))
                if not tests:
                    # Chapter without tests
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

        ser = ClientTestsFlatItemSerializer(flat_items, many=True)
        return response.Response(ser.data)
