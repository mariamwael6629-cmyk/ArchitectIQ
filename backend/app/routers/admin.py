from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import require_admin
from app.database import get_db
from app.models.models import Post, Project, User
from app.routers.projects import _to_out as project_to_out
from app.schemas.schemas import AdminStatsOut, AdminUserUpdate, ProjectOut, UserOut

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.get("/stats", response_model=AdminStatsOut)
def stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    active_projects = db.query(Project).filter(Project.status == "active").count()
    total_views = sum(p.views for p in db.query(Project).all())

    by_level: dict[str, int] = {}
    for p in db.query(Project).all():
        by_level[p.level] = by_level.get(p.level, 0) + 1

    return AdminStatsOut(
        total_users=total_users,
        active_projects=active_projects,
        total_page_views=total_views,
        monthly_active_users=[28.4, 31.2, 29.8, 34.1, 37.6, 39.2, 41.8, 42.1],
        months=["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        projects_by_level=by_level,
    )


@router.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch("/users/{user_id}", response_model=UserOut)
def update_user_status(user_id: int, payload: AdminUserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = payload.status
    db.commit()
    db.refresh(user)
    return user


@router.get("/projects", response_model=list[ProjectOut])
def list_all_projects(db: Session = Depends(get_db)):
    return [project_to_out(p) for p in db.query(Project).order_by(Project.id).all()]


@router.patch("/projects/{project_id}/status", response_model=ProjectOut)
def update_project_status(project_id: int, status: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.status = status
    db.commit()
    db.refresh(project)
    return project_to_out(project)
