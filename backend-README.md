# ArchitectIQ Backend

FastAPI backend for the ArchitectIQ platform: auth, project library, community forum, dashboard, and admin analytics.

## Structure

```
backend/
├── app/
│   ├── core/          config, JWT/password security, auth dependencies
│   ├── models/         SQLAlchemy ORM models
│   ├── schemas/         Pydantic request/response schemas
│   ├── routers/        API endpoints (auth, projects, forum, dashboard, admin)
│   ├── database.py     SQLAlchemy engine/session
│   ├── seed.py          Seeds projects, badges, forum posts, and an admin user
│   └── main.py          FastAPI app, CORS, error handlers, startup
├── requirements.txt
└── .env.example
```

## Setup

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # adjust SECRET_KEY before deploying
uvicorn app.main:app --reload --port 8000
```

The SQLite database and seed data (18 projects, 12 badges, sample forum posts, and an admin account) are created automatically on first run.

Default admin login: `admin@architectiq.dev` / `Admin123!` — change this password immediately in any real deployment.

## API docs

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Key endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | – | Create account, returns JWT |
| POST | /api/auth/login | – | Login, returns JWT |
| GET | /api/auth/me | required | Current user |
| GET | /api/projects | – | List/search/filter project library |
| POST | /api/projects | required | Submit a new project |
| GET | /api/forum/posts | – | List forum posts |
| POST | /api/forum/posts | required | Create a post |
| POST | /api/forum/posts/{id}/like | – | Like a post |
| GET | /api/dashboard/me | required | Progress, badges, saved projects |
| POST | /api/dashboard/architectures | required | Save a builder architecture |
| GET | /api/admin/stats | admin | Platform analytics |
| GET | /api/admin/users | admin | User list |
| GET | /api/admin/projects | admin | Project moderation list |

## Frontend integration

The frontend (`architectiq.html`) calls this API via `API_BASE` (default `http://localhost:8000/api`). It degrades gracefully to its built-in demo data if the backend is unreachable, so the static page still works standalone. Override the base URL by setting `window.ARCHITECTIQ_API_BASE` before the page's script runs.

CORS origins are configured via `CORS_ORIGINS` in `.env` (comma-separated; use `*` to allow all).
