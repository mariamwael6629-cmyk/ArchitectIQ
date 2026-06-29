# ArchitectIQ 🚀

ArchitectIQ is a premium, interactive educational ecosystem designed for software engineers and architects to master large-scale system design. The platform bridges the gap between theoretical distributed systems concepts and practical production setups through real-world case studies, hands-on architectural canvas modeling, community discussions, and gamified progress tracking.

---

## 🌟 Features

### 1. Project Library & Real-World Case Studies
* **Curated System Blueprints:** Explore detailed architectural blueprints of platforms like Netflix, YouTube, Uber, and WhatsApp.
* **Difficulty Categorization:** Projects range from *Beginner* (Rate Limiter) to *Intermediate* (Real-Time Chat) and *Enterprise Scale* (Content Delivery Networks).

### 2. Interactive Architecture Canvas (The Builder)
* **Drag-and-Drop Editor:** Intuitively place infrastructure nodes such as CDNs, Load Balancers, API Gateways, Microservices, Databases, and Message Queues onto a grid-backed workspace.
* **Smart Connections:** Link infrastructure layers to visualize data flow, network routing, and distributed components seamlessly.

### 3. Learning Hub & Fundamentals
* **Deep-Dive Concepts:** Animation-backed explainers detailing core topics like Consistent Hashing, Database Sharding, CAP Theorem, and Circuit Breakers.
* **Structured Learning Track:** High-quality breakdown divided into digestible fundamentals versus expert-level technical articles.

### 4. Interactive Community Forum
* **Knowledge Sharing:** A collaborative feed where engineers debate architectural trade-offs (e.g., Saga vs. 2PC, Shared DBs in microservices).
* **Live Events Sidebar:** Stay up to date with upcoming webinars, AMA panels, and Architecture Review challenges.

### 5. Gamified User Dashboard & Badges
* **Metric Trackers:** Visually monitor completed projects, total learning progress percentages, and earned points.
* **Achievement Rewards:** Unlock specialty credential badges such as *First Deploy*, *Cache Master*, *Data Guru*, and *Architect* to showcase skill growth.

### 6. Admin Control Center & Platform Analytics
* **Business Insights:** Track system adoption metrics including monthly active user distributions, page views per month, and breakdown of project distributions by difficulty tier.
* **Resource & User Operations:** Clean tabular views to search, review, approve, and manage user statuses and newly submitted architectural projects.

---

## 🛠️ Tech Stack

* **Frontend:** Single static HTML file (`architectiq.html`) — vanilla JS/CSS, no build step, no framework. All pages (Library, Builder, Learning Hub, Community, Dashboard, Admin) are client-side rendered.
* **Backend:** Python, FastAPI + SQLAlchemy, SQLite (file-based, no separate DB server). JWT auth (`python-jose`) with bcrypt password hashing (`passlib`). Layered as `core/` (config, security, auth deps) → `models/` → `schemas/` → `routers/`, assembled in `backend/app/main.py`.
* **API docs:** Auto-generated interactive Swagger UI and ReDoc at `/docs` / `/redoc` once the backend is running.
* **Resilience:** The frontend works fully standalone with built-in demo data — every API call degrades gracefully to local/static state if the backend is unreachable.

---

## 🚀 Getting Started

### Prerequisites
* Python 3.9+
* A modern browser (Chrome/Edge/Firefox/Safari)

### 1. Clone the repository

```bash
git clone https://github.com/mariamwael6629-cmyk/architectiq.git
cd architectiq
```

### 2. Run the backend (optional but recommended for full functionality)

```bash
cd backend
python3 -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # adjust SECRET_KEY before deploying
uvicorn app.main:app --reload --port 8000
```

The SQLite database and seed data (18 projects, 12 badges, sample forum posts, and an admin account) are created automatically on first run.

Default admin login: `admin@architectiq.dev` / `Admin123!` — change this password immediately in any real deployment.

* API base: `http://localhost:8000/api`
* Swagger UI: `http://localhost:8000/docs`
* ReDoc: `http://localhost:8000/redoc`

### 3. Open the frontend

Just open `architectiq.html` directly in a browser, or serve it with any static file server. It calls the backend via `API_BASE` (default `http://localhost:8000/api`); override this by setting `window.ARCHITECTIQ_API_BASE` before the page's script runs. If the backend isn't running, the page falls back to its built-in demo data and remains fully usable on its own.

CORS origins are configured via `CORS_ORIGINS` in `backend/.env` (comma-separated; use `*` to allow all).

---

## 📁 Project Structure

```
architectiq/
├── architectiq.html      # Entire frontend: HTML/CSS/JS, single file
├── backend/
│   ├── app/
│   │   ├── core/          # config, JWT/password security, auth dependencies
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   ├── routers/       # API endpoints (auth, projects, forum, dashboard, admin)
│   │   ├── database.py    # SQLAlchemy engine/session
│   │   ├── seed.py        # Seeds projects, badges, forum posts, and an admin user
│   │   └── main.py        # FastAPI app, CORS, error handlers, startup
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

See [`backend/README.md`](./backend/README.md) for the full backend API reference and endpoint table.

---

## 📖 API Reference

All endpoints are namespaced under `/api/*`. Full request/response schemas are documented interactively at `/docs` once the backend is running. Summary:

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
