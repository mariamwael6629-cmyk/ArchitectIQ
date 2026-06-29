from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="user")  # user | admin
    status: Mapped[str] = mapped_column(String(20), default="active")  # active | pending | inactive
    points: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    posts: Mapped[list["Post"]] = relationship(back_populates="author", cascade="all, delete-orphan")
    saved_projects: Mapped[list["SavedProject"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    architectures: Mapped[list["Architecture"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    badges: Mapped[list["UserBadge"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    level: Mapped[str] = mapped_column(String(20))  # beginner|intermediate|advanced|enterprise
    time_estimate: Mapped[str] = mapped_column(String(20), default="")
    stars: Mapped[float] = mapped_column(Float, default=4.5)
    views: Mapped[int] = mapped_column(Integer, default=0)
    topics: Mapped[str] = mapped_column(String(255), default="")  # comma separated
    author: Mapped[str] = mapped_column(String(120), default="ArchitectIQ Team")
    status: Mapped[str] = mapped_column(String(20), default="active")  # active|pending
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(255))
    body: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(20), default="latest")  # trending|latest
    likes: Mapped[int] = mapped_column(Integer, default=0)
    comments: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    author: Mapped["User"] = relationship(back_populates="posts")


class SavedProject(Base):
    __tablename__ = "saved_projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    user: Mapped["User"] = relationship(back_populates="saved_projects")


class Architecture(Base):
    __tablename__ = "architectures"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(200))
    nodes_json: Mapped[str] = mapped_column(Text)  # JSON-encoded nodes
    edges_json: Mapped[str] = mapped_column(Text)  # JSON-encoded edges
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    user: Mapped["User"] = relationship(back_populates="architectures")


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)
    icon: Mapped[str] = mapped_column(String(10))


class UserBadge(Base):
    __tablename__ = "user_badges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    badge_id: Mapped[int] = mapped_column(ForeignKey("badges.id"))

    user: Mapped["User"] = relationship(back_populates="badges")
    badge: Mapped["Badge"] = relationship()
