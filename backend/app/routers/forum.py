from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.models import Post, User
from app.schemas.schemas import PostCreate, PostOut

router = APIRouter(prefix="/api/forum", tags=["forum"])


def _to_out(p: Post) -> PostOut:
    return PostOut(
        id=p.id,
        title=p.title,
        body=p.body,
        category=p.category,
        likes=p.likes,
        comments=p.comments,
        created_at=p.created_at,
        author_name=p.author.name if p.author else "Unknown",
    )


@router.get("/posts", response_model=list[PostOut])
def list_posts(category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Post)
    if category and category != "all":
        query = query.filter(Post.category == category)
    posts = query.order_by(Post.created_at.desc()).all()
    return [_to_out(p) for p in posts]


@router.post("/posts", response_model=PostOut, status_code=201)
def create_post(
    payload: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = Post(author_id=current_user.id, title=payload.title, body=payload.body, category="latest")
    db.add(post)
    db.commit()
    db.refresh(post)
    return _to_out(post)


@router.post("/posts/{post_id}/like", response_model=PostOut)
def like_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.likes += 1
    db.commit()
    db.refresh(post)
    return _to_out(post)
