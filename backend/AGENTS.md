# Django DRF Project Rules

## 1. General Goals
- Separate **admin (back-office CRUD)** and **client (front-office)** logic.
- Use a **folderized structure** for scalability and clarity.

---

## 2. Directory Structure

Each domain app (example: `courses`) follows this layout:

app_name/
  apps.py
  admin.py
  models/
    __init__.py        # re-export all models
    model_a.py
    model_b.py
  serializers/
    admin/
      __init__.py
      entity.py
    client/
      __init__.py
      entity.py
  views/
    admin/
      __init__.py
      entity.py
    client/
      __init__.py
      entity.py
  urls/
    admin/
      __init__.py
      entity.py
    client/
      __init__.py
      entity.py
  tests.py

Shared utilities:

common/
  enums.py
  permissions.py
  pagination.py
  utils.py

---

## 3. Models
- One file per model in `models/`.
- Always import/export models in `models/__init__.py`:

  from .course import Course
  from .chapter import Chapter
  __all__ = ["Course", "Chapter"]

- Use string relations to avoid circular imports:
  course = models.ForeignKey("courses.Course", on_delete=models.CASCADE)

- Add Meta rules where relevant:
  - `unique_together` or `UniqueConstraint` for composite uniqueness.
  - `ordering` for default sort.
  - Index fields used for filtering.

---

## 4. Serializers
- May expose most/all fields for back-office CRUD.

---

## 5. Views
- Split into `views/admin/` and `views/client/`.
- Prefer DRF `generics` (example: `generics.ListAPIView` or `generics.CreateAPIView`).
- Permissions:
  - Admin &rarr; `IsAdminUser` or a custom `IsAdminOrReadOnly`.
  - Client &rarr; `IsAuthenticated` plus per-user scoping in `get_queryset()`.

Example client scoping:

def get_queryset(self):
    return UserTest.objects.filter(user=self.request.user)

---

## 6. URLs
- Each app exports `urls/admin.py` and `urls/client.py` with DRF routers.

Root `server/urls.py`:

from django.urls import path, include

urlpatterns = [
    path("api/", include("urls.admin")),
    path("api/client/", include("urls.client")),
]

---

## 7. Testing
- No test is needed

---

## 8. Coding Rules
- Files: `snake_case.py`; Classes: `PascalCase`; Functions/vars: `snake_case`.
- Use `select_related` / `prefetch_related` to avoid N+1 queries.
- Paginate list endpoints by default.
- Keep views thin; push logic down to services/selectors.

---

## 9. Adding a New Entity (Playbook)
1) **Model** &rarr; create `models/entity.py` and re-export in `models/__init__.py`.
2) **Serializers** &rarr; implement in both `serializers/admin/` and `serializers/client/`.
3) **Views** &rarr; implement in `views/admin/` and `views/client/`.
4) **URLs** &rarr; register routes in `urls/admin/` and `urls/client/`.
5) Run:
   - python manage.py makemigrations

Definition of Done:
- Endpoints available under `/api/...` and `/api/client/...`.

---