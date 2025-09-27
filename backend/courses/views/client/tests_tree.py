from rest_framework import generics, permissions, response
from django.db.models import Max
from courses.models import Course, UserTest
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

        # First build the flat list of items (without status) and track test IDs
        flat_items = []
        collected_test_ids = set()
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
                    collected_test_ids.add(test.test_id)

        # Compute user's best score per test in a single query
        best_scores = {}
        if collected_test_ids:
            qs_scores = (
                UserTest.objects
                .filter(user=request.user, test_id__in=collected_test_ids)
                .values("test_id")
                .annotate(max_score=Max("score_count"))
            )
            best_scores = {row["test_id"]: (row["max_score"] or 0) for row in qs_scores}

        # Assign statuses with at most one global active test
        active_assigned = False
        for item in flat_items:
            test = item.get("test")
            if test is None:
                item["status"] = None
                continue
            max_score = best_scores.get(test.test_id, 0)
            passing = test.passing_score if test.passing_score is not None else 0
            has_passed = max_score > passing
            if has_passed:
                item["status"] = "passed"
            elif not active_assigned:
                item["status"] = "active"
                active_assigned = True
            else:
                item["status"] = "locked"

        ser = ClientTestsFlatItemSerializer(flat_items, many=True)
        return response.Response(ser.data)
