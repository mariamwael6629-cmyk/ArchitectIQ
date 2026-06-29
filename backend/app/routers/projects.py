from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.models import Project, SavedProject, User
from app.schemas.schemas import ProjectCreate, ProjectOut

router = APIRouter(prefix="/api/projects", tags=["projects"])


def _to_out(p: Project) -> ProjectOut:
    return ProjectOut(
        id=p.id,
        title=p.title,
        description=p.description,
        level=p.level,
        time_estimate=p.time_estimate,
        stars=p.stars,
        views=p.views,
        topics=[t for t in p.topics.split(",") if t],
        author=p.author,
        status=p.status,
    )


@router.get("", response_model=list[ProjectOut])
def list_projects(level: str | None = None, q: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Project)
    if level and level != "all":
        query = query.filter(Project.level == level)
    if q:
        query = query.filter(Project.title.ilike(f"%{q}%"))
    return [_to_out(p) for p in query.order_by(Project.id).all()]


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    p.views += 1
    db.commit()
    return _to_out(p)


@router.post("", response_model=ProjectOut, status_code=201)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    p = Project(
        title=payload.title,
        description=payload.description,
        level=payload.level,
        time_estimate=payload.time_estimate,
        topics=",".join(payload.topics),
        author=current_user.name,
        status="pending",
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return _to_out(p)


@router.post("/{project_id}/save", status_code=204)
def save_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.query(Project).filter(Project.id == project_id).first():
        raise HTTPException(status_code=404, detail="Project not found")
    exists = (
        db.query(SavedProject)
        .filter(SavedProject.user_id == current_user.id, SavedProject.project_id == project_id)
        .first()
    )
    if not exists:
        db.add(SavedProject(user_id=current_user.id, project_id=project_id))
        db.commit()
