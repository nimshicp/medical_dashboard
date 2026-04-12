# ?? Medical Dashboard System

A high-performance, secure medical management platform built with **React + Vite** and **Django REST Framework**. This system handles sensitive patient records, role-based access control, and asynchronous media processing.

---

## ?? System Architecture

The project follows a **Decoupled Three-Tier Architecture** with a dedicated asynchronous processing layer.

### **1. Component Diagram**
Visualizes the high-level interaction between the frontend, API, message broker, and background workers.



### **2. Technical Stack**
* **Frontend:** React 18, Vite, Tailwind CSS, Axios (JWT persistence).
* **Backend:** Python 3.10+, Django 5.x, Django REST Framework.
* **Database:** PostgreSQL (Primary Relational Store).
* **Task Queue:** Redis (Message Broker) + Celery (Background Worker).
* **Observability:** Middleware-based logging to `logs/app.log` and `logs/error.log`.

---

## ?? Data Model (ER Diagram)

The system uses **Django ORM** to manage the following relational structure:



* **User:** Custom model supporting `admin` and `doctor` roles.
* **Patient:** Encapsulates medical records; visibility is restricted by `doctor_id`.
* **MediaFile:** Tracks processing states (`PENDING`, `PROCESSING`, `COMPLETED`).

---

## ?? Core Runtime Flows

### **Authentication Sequence**
The system implements a **Split-Token JWT Strategy**. The UI receives a short-lived Access Token in the JSON body and a long-lived Refresh Token via an `HttpOnly` cookie.



### **Media Upload Async Flow**
To ensure the UI remains responsive, file processing (metadata extraction) is offloaded to Celery workers.



---

## ?? Getting Started

### **1. Infrastructure Setup (Prerequisites)**
Before running the application, you must have **PostgreSQL** and **Redis** running.

#### **Running Redis Locally**
Redis is required as the message broker for Celery.
* **macOS:** `brew install redis` then `brew services start redis`
* **Ubuntu/WSL:** `sudo apt install redis-server` then `sudo service redis-server start`
* **Verification:** Run `redis-cli ping`. It should respond with `PONG`.

---

### **2. Backend & Worker Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Database Initialization (CRITICAL STEP)
python manage.py makemigrations
python manage.py migrate 

# Start Django API
python manage.py runserver 8000

# Start Celery Worker (In a separate terminal)
celery -A medical_dashboard worker --loglevel=info
```

### **3. Frontend Setup**
```bash
cd frontend/medical_dashboard
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## ?? Running with Docker

The project can be run manually, but using Docker Compose is highly recommended as it automatically configures the Database, Redis, the API, and the Workers in a synced environment.

1.  **Build and Start Containers:**
    ```bash
    cd docker
    docker-compose up --build
    ```
2.  **Run Migrations inside the Container:**
    ```bash
    docker-compose exec backend python manage.py migrate
    ```

---

## ?? API Surface Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/login/` | `POST` | Get access token + Refresh cookie. |
| `/api/auth/refresh/` | `POST` | Refresh access token using cookie. |
| `/api/patients/` | `GET/POST` | Patient CRUD (Filtered by Role). |
| `/api/media/` | `POST` | Upload file/URL (Triggers Celery). |
| `/admin/` | `GET` | Django Admin interface. |

---

## ?? Important Troubleshooting

* **Missing Tables Error:** If you encounter `relation "users_user" does not exist`, you **must** run `python manage.py migrate`. This usually happens when the database is fresh or the custom user model hasn't been initialized.
* **Redis Connection:** If media uploads stay in `PENDING` or throw an error, ensure Redis is running on port `6379`.
* **CORS Issues:** If the frontend can't talk to the API, ensure `CORS_ALLOWED_ORIGINS` in `settings.py` includes `http://localhost:5173`. add this to readme without changing any content
