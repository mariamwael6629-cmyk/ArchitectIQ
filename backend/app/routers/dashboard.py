import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.models import Architecture, Badge, Project, SavedProject, User, UserBadge
from app.routers.projects import _to_out as project_to_out
from app.schemas.schemas import (
    ArchitectureCreate,
    ArchitectureOut,
    BadgeOut,
    DashboardOut,
)

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/me", response_model=DashboardOut)
def my_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    all_badges = db.query(Badge).all()
    earned_ids = {ub.badge_id for ub in current_user.badges}
    badges = [BadgeOut(name=b.name, icon=b.icon, earned=b.id in earned_ids) for b in all_badges]

    saved = (
        db.query(Project)
        .join(SavedProject, SavedProject.project_id == Project.id)
        .filter(SavedProject.user_id == current_user.id)
        .all()
    )

    archs_completed = len(current_user.architectures)
    progress_pct = min(100, archs_completed * 10 + len(earned_ids) * 5)

    return DashboardOut(
        projects_completed=archs_completed,
        learning_progress_pct=progress_pct,
        badges_earned=len(earned_ids),
        badges=badges,
        saved_projects=[project_to_out(p) for p in saved],
    )


@router.post("/architectures", response_model=ArchitectureOut, status_code=201)
def save_architecture(
    payload: ArchitectureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    arch = Architecture(
        user_id=current_user.id,
        name=payload.name,
        nodes_json=json.dumps(payload.nodes),
        edges_json=json.dumps(payload.edges),
    )
    db.add(arch)

    first_deploy = db.query(Badge).filter(Badge.name == "First Deploy").first()
    if first_deploy and not db.query(UserBadge).filter(
        UserBadge.user_id == current_user.id, UserBadge.badge_id == first_deploy.id
    ).first():
        db.add(UserBadge(user_id=current_user.id, badge_id=first_deploy.id))

    db.commit()
    db.refresh(arch)
    return ArchitectureOut(
        id=arch.id, name=arch.name, nodes=payload.nodes, edges=payload.edges, created_at=arch.created_at
    )


@router.get("/architectures", response_model=list[ArchitectureOut])
def list_architectures(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    out = []
    for a in current_user.architectures:
        out.append(
            ArchitectureOut(
                id=a.id,
                name=a.name,
                nodes=json.loads(a.nodes_json),
                edges=json.loads(a.edges_json),
                created_at=a.created_at,
            )
        )
    return out
