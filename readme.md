# Prolingo


## Resources
| Library | Documentation | Role
| - | - | - |
DJango | [Link](https://docs.djangoproject.com/en/5.2/topics/db/models/) | **Backend framework**. Manages databases (users, products, posts, etc.). Handles authentication, APIs (usually REST or GraphQL). Decides what data should be sent to the frontend.
React.js | [Link](https://react.dev/reference/react-dom/components/common) | **Frontend framework**. Renders components (buttons, forms, dashboards, etc.). Updates the page dynamically without reloading (Single Page Application). Talks to Django via APIs using axios.
Vite | [Link](https://vite.dev/guide/cli.html) | **Front end build tool**. Runs a fast dev server so you can see changes instantly.Compiles JSX/TSX into browser-ready JavaScript. Optimizes files for production (minification, bundling).

## Installation Guide
1. **Ensure Python 3.13, PIP, PostgreSQL, NPM 11+ and Node 22+ is installed**
    Install missing libraries\
    [Node installer](https://nodejs.org/en/download/)\
    [Python installer](https://www.python.org/downloads/)\
    [PostgreSQL installer](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

2. **Install environment and checking environment**\
    Windows:
    ```bash
    python -m venv .venv
    .venv\Scripts\activate.bat

    Get-Command python
    ```
    MacOS:
    ```bash
    python -m venv .venv
    source .venv\bin\activate

    which python
    ```
    Make sure it shows that the python binary points to venv inside of he project.

3. **Install backend dependencies**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

4. **Setup PostgreSQL**
    ```bash
    psql -U postgres
    CREATE DATABASE prolingo;
    exit
    ```

4. **Setup DJango**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```
    The backend now runs at http://127.0.0.1:8000

5. **Setup Frontend**
    ```bash
    cd web
    npm install
    npm run dev
    ```
    The frontend now runs at http://localhost:5173/

## DJango App Creation Guide

1. **Create folder**\
    Create a folder named after the app.

2. **Create the app**\
    Create `apps.py` and paste the following code:
    ```py
    from django.apps import AppConfig

    class <APP_NAME>Config(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "<APP_NAME>"
    ```
    Replace `<APP_NAME>` with the app name

3. **Create model**\
    Create `models.py` inside the app folder

    ```py
    from django.db import models

    class <APP_NAME>(models.Model):
        name = models.CharField(max_length=255)

        def __str__(self):
            return self.name
    ```
    Replace `<APP_NAME>` with the app name

4. **Create views.py**
    Create `views.py` inside the app folder:
    ```py
    from rest_framework import viewsets
    from .models import <APP_NAME>
    from .serializers import <APP_NAME>Serializer

    class <APP_NAME>ViewSet(viewsets.ModelViewSet):
        queryset = <APP_NAME>.objects.all()
        serializer_class = <APP_NAME>Serializer
    ```
    Replace `<APP_NAME>` with the app name.

5. **Create serializers.py**
    Create `serializers.py` inside the app folder:
    ```py
    from rest_framework import serializers
    from .models import <APP_NAME>

    class <APP_NAME>Serializer(serializers.ModelSerializer):
        class Meta:
            model = <APP_NAME>
            fields = '__all__'
    ```
    Replace `<APP_NAME>` with the app name.

6. **Create urls.py**
    Create `urls.py` inside the app folder:
    ```py
    from django.urls import path, include
    from rest_framework.routers import DefaultRouter
    from .views import <APP_NAME>ViewSet

    router = DefaultRouter()
    router.register(r'<app_name>', <APP_NAME>ViewSet)

    urlpatterns = [
        path('', include(router.urls)),
    ]
    ```
    Replace `<APP_NAME>` and `<app_name>` with the app name.

7. **Include app URLs in project urls.py**
    In your main `urls.py`, add:
    ```py
    path('<app_name>/', include('<APP_NAME>.urls')),
    ```
    Replace `<APP_NAME>` and `<app_name>` with the app name.
8. **Run migrations**
    ```bash
    python manage.py makemigrations <APP_NAME>
    python manage.py migration
    ```
    Replace `<APP_NAME>` with the app name.
