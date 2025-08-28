# Prolingo


## Resources
| Library | Documentation | Role
| - | - | - |
DJango | [Link](https://docs.djangoproject.com/en/5.2/topics/db/models/) | **Backend framework**. Manages databases (users, products, posts, etc.). Handles authentication, APIs (usually REST or GraphQL). Decides what data should be sent to the frontend.
React.js | [Link](https://react.dev/reference/react-dom/components/common) | **Frontend framework**. Renders components (buttons, forms, dashboards, etc.). Updates the page dynamically without reloading (Single Page Application). Talks to Django via APIs using axios.
Vite | [Link](https://vite.dev/guide/cli.html) | **Front end build tool**. Runs a fast dev server so you can see changes instantly.Compiles JSX/TSX into browser-ready JavaScript. Optimizes files for production (minification, bundling).
Tailwind | [Link](https://tailwindcss.com/docs/styling-with-utility-classes) | **Styling framework**. Provides utility classes like flex, bg-blue-500, p-4 instead of writing custom CSS. Makes it easier to build responsive, consistent designs.

## Installation Guide (Windows)
1. **Ensure python 3.13, pip, npm 11+ and node 22+ is installed**
    ```bash
    python --version
    pip --version
    node --version
    npm --version
    ```
    Install missing libraries

2. **Install environment**
    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```

3. **Install backend dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4. **Setup DJango**
    ```bash
    cd backend
    python manage.py migrate
    python manage.py runserver
    ```
    The backend now runs at http://127.0.0.1:8000

5. **Setup Frontend**
    ```bash
    cd ..\web
    npm install
    npm run dev
    ```
Installation for MacOS

## Installation Guide (macOS)
1. **Ensure Python 3.13, pip, Node 22+ and npm 11+ are installed**
    ```bash
    python3 --version
    pip3 --version
    node --version
    npm --version
    ```
    Install missing dependencies:
    - [Python downloads](https://www.python.org/downloads/macos/)
    - [Node.js downloads](https://nodejs.org/)

2. **Create virtual environment**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install backend dependencies**
    ```bash
    pip3 install -r requirements.txt
    ```

4. **Setup Django**
    ```bash
    cd backend
    python3 manage.py migrate
    python3 manage.py runserver
    ```
    The backend now runs at [http://127.0.0.1:8000](http://127.0.0.1:8000)

5. **Setup Frontend**
    ```bash
    cd ../web
    npm install
    npm run dev
    ```
    The frontend now runs at [http://127.0.0.1:5173](http://127.0.0.1:5173) (default Vite port)
