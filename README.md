# MedDash

MedDash is a full-stack medical dashboard for managing users, patients, and medical media files.

It includes:
- JWT authentication with refresh-token cookies
- role-based access for `admin` and `doctor`
- patient CRUD with doctor assignment
- media upload with background processing via Celery
- password reset flow
- API request and error logging

## Tech Stack

### Backend
- Django 5
- Django REST Framework
- SimpleJWT
- PostgreSQL
- Redis
- Celery

### Frontend
- React
- Vite
- Axios
- React Router
- Tailwind CSS

## Project Structure

```text
medical-dashboard/
├── backend/                   # Django backend
│   ├── medical_dashboard/     # Django project settings
│   ├── users/                 # Authentication, roles, password reset
│   ├── patients/              # Patient CRUD and filtering
│   ├── media_files/           # Media upload and Celery processing
│   ├── Dockerfile
│   └── .env
├── frontend/
│   └── medical_dashboard/     # React frontend
│       └── .env
├── docker/
│   └── docker-compose.yml     # Backend + Postgres + Redis + Celery
└── README.md
```

## Features

### Authentication
- Register and login
- Access token + refresh token flow
- Refresh token stored in HttpOnly cookie
- Forgot password and reset password flow
- `/api/auth/me/` endpoint for current user profile

### Roles
- `doctor`
  - can only see assigned patients
  - patient creation auto-assigns to that doctor
- `admin`
  - can see all patients
  - can assign doctors to patients
  - can reassign doctors on patient edit

### Patients
- create, list, update, delete
- filter by:
  - name
  - tag
  - created date
- tag support for each patient

### Media Files
- upload media to a patient
- background processing with Celery
- processing status updates

### Observability
- request logging middleware
- file logging for app and error events
- Celery task logging
- logs written to `backend/logs/`

## API Overview

### Auth
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`
- `POST /api/auth/forgot-password/`
- `POST /api/auth/reset-password/<uid>/<token>/`
- `GET /api/auth/doctors/`

### Patients
- `GET /api/patients/`
- `POST /api/patients/`
- `GET /api/patients/<id>/`
- `PATCH /api/patients/<id>/`
- `DELETE /api/patients/<id>/`

### Media
- `GET /api/media/`
- `POST /api/media/`

## Environment Variables

### Backend

Important variables:
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `CELERY_BROKER_URL`
- `EMAIL_BACKEND`
- `DEFAULT_FROM_EMAIL`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USE_TLS`
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`

### Frontend

Important variables:
- `VITE_API_URL`

## Local Development

### Backend
From `backend/`:

```bash
python manage.py migrate
python manage.py runserver
```

### Frontend
From `frontend/medical_dashboard/`:

```bash
npm install
npm run dev
```

### Celery Worker
From `backend/`:

```bash
celery -A medical_dashboard worker -l info
```

## Run With Docker

From the `docker/` folder:

```bash
docker compose up --build
```

Services started:
- Django backend
- PostgreSQL
- Redis
- Celery worker

## Logging

Application logs are stored in:
- `backend/logs/app.log`
- `backend/logs/error.log`

Logged events include:
- API requests
- auth flow warnings and failures
- patient creation events
- media upload events
- background task execution and failures

## Notes

- Refresh tokens are cookie-based and not exposed to frontend JavaScript.
- Admin users must assign a doctor when creating a patient.
- Docker compose file lives in `docker/`, so run compose from there or use `-f docker/docker-compose.yml`.

## Future Improvements

- add production-ready WSGI/ASGI server setup
- add frontend Docker service
- add test coverage
- add OpenAPI/Swagger usage docs
- add deployment guide
