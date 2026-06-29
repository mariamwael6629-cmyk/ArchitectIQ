from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ── Auth ──────────────────────────────────────────────────────────────────
class UserRegister(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    status: str
    points: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Projects ──────────────────────────────────────────────────────────────
class ProjectOut(BaseModel):
    id: int
    title: str
    description: str
    level: str
    time_estimate: str
    stars: float
    views: int
    topics: list[str]
    author: str
    status: str

    class Config:
        from_attributes = True


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    level: str
    time_estimate: str = ""
    topics: list[str] = []


# ── Forum ─────────────────────────────────────────────────────────────────
class PostCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    body: str = Field(min_length=1)


class PostOut(BaseModel):
    id: int
    title: str
    body: str
    category: str
    likes: int
    comments: int
    created_at: datetime
    author_name: str

    class Config:
        from_attributes = True


# ── Dashboard ─────────────────────────────────────────────────────────────
class BadgeOut(BaseModel):
    name: str
    icon: str
    earned: bool


class DashboardOut(BaseModel):
    projects_completed: int
    learning_progress_pct: int
    badges_earned: int
    badges: list[BadgeOut]
    saved_projects: list[ProjectOut]


# ── Architecture (builder save) ──────────────────────────────────────────
class ArchitectureCreate(BaseModel):
    name: str
    nodes: list[dict]
    edges: list[dict]


class ArchitectureOut(BaseModel):
    id: int
    name: str
    nodes: list[dict]
    edges: list[dict]
    created_at: datetime

    class Config:
        from_attributes = True


# ── Admin ─────────────────────────────────────────────────────────────────
class AdminStatsOut(BaseModel):
    total_users: int
    active_projects: int
    total_page_views: int
    monthly_active_users: list[float]
    months: list[str]
    projects_by_level: dict[str, int]


class AdminUserUpdate(BaseModel):
    status: str
