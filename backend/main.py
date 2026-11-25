
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime, timezone
import os
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import Base, engine, SessionLocal
import models

app = FastAPI(
    title="Masters Tech API",
    description="Backend API for the Masters Tech business platform",
    version="1.0.0",
)

# Set FRONTEND_ORIGINS to a comma-separated list of trusted frontend origins
# when deploying. Keep the local origins as the development default.
frontend_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str
    category: str = Field(min_length=1, max_length=100)
    status: str = "Completed"
    image_url: str | None = None
    project_url: str | None = None


@app.get("/")
def home():
    return {
        "success": True,
        "message": "Masters Tech API is running!",
    }


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Check both API availability and the PostgreSQL database connection."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception:
        raise HTTPException(
            status_code=503,
            detail={"status": "unhealthy", "database": "unavailable"},
        )


def project_response(project):
    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "category": project.category,
        "status": project.status,
        "image_url": project.image_url,
        "project_url": project.project_url,
        "created_at": project.created_at,
    }


@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    projects = (
        db.query(models.Project)
        .order_by(models.Project.created_at.desc())
        .all()
    )
    return [project_response(project) for project in projects]


@app.post("/api/projects", status_code=201)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
):
    project = models.Project(**project_data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project_response(project)


@app.put("/api/projects/{project_id}")
def update_project(
    project_id: int,
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
):
    project = db.get(models.Project, project_id)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    for field, value in project_data.model_dump().items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project_response(project)


@app.delete("/api/projects/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = db.get(models.Project, project_id)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()

    return {
        "success": True,
        "message": "Project deleted successfully",
    }


class PublicReviewCreate(BaseModel):
    customer: str = Field(min_length=2, max_length=120)
    rating: int = Field(ge=1, le=5)
    project: str = Field(default="", max_length=160)
    review: str = Field(min_length=8, max_length=2000)


@app.get("/api/public/reviews")
def get_approved_public_reviews(db: Session = Depends(get_db)):
    """Return only reviews explicitly approved by the administrator."""
    records = (
        db.query(models.WorkspaceRecord)
        .filter(models.WorkspaceRecord.section == "reviews")
        .order_by(models.WorkspaceRecord.id.desc())
        .all()
    )
    approved = []
    for record in records:
        if record.data.get("status") == "Approved":
            approved.append({"id": record.record_key, **record.data})
    return approved


@app.get("/api/public/promotion")
def get_active_public_promotion(db: Session = Depends(get_db)):
    """Return the active, non-expired homepage promotion without exposing the full pricing catalogue."""
    records = (
        db.query(models.WorkspaceRecord)
        .filter(models.WorkspaceRecord.section == "pricing")
        .all()
    )
    today = datetime.now(timezone.utc).date()
    for record in records:
        data = record.data
        if data.get("recordType") != "promotion" or data.get("status") != "Active":
            continue
        ends_at = data.get("endsAt")
        if ends_at:
            try:
                if datetime.strptime(ends_at, "%Y-%m-%d").date() < today:
                    continue
            except ValueError:
                continue
        return {
            "discountPercent": int(data.get("discountPercent", 20)),
            "message": data.get("message", "Get a special discount on your next website project."),
            "appliesTo": data.get("appliesTo", "Website development services"),
            "endsAt": ends_at or "",
        }
    return None


@app.post("/api/reviews", status_code=201)
def submit_public_review(
    review_data: PublicReviewCreate,
    db: Session = Depends(get_db),
):
    """Accept a public website review and hold it for admin approval."""
    import uuid

    review_record = models.WorkspaceRecord(
        section="reviews",
        record_key=str(uuid.uuid4()),
        data={
            "customer": review_data.customer.strip(),
            "rating": review_data.rating,
            "project": review_data.project.strip(),
            "review": review_data.review.strip(),
            "status": "Pending approval",
            "source": "Website",
            "submittedAt": datetime.now(timezone.utc).isoformat(),
        },
    )
    db.add(review_record)
    db.commit()
    db.refresh(review_record)
    return {"success": True, "message": "Thank you. Your review has been submitted for approval."}


WORKSPACE_SECTIONS = {
    "clients", "leads", "tasks", "invoices",
    "payments", "messages", "reviews", "settings", "pricing",
}


def validate_workspace_section(section: str):
    if section not in WORKSPACE_SECTIONS:
        raise HTTPException(status_code=404, detail="Workspace section not found")


@app.get("/api/workspace/{section}")
def get_workspace_records(section: str, db: Session = Depends(get_db)):
    validate_workspace_section(section)
    records = (
        db.query(models.WorkspaceRecord)
        .filter(models.WorkspaceRecord.section == section)
        .order_by(models.WorkspaceRecord.id.asc())
        .all()
    )
    return [
        {"id": record.record_key, **record.data}
        for record in records
    ]


@app.put("/api/workspace/{section}")
def replace_workspace_records(
    section: str,
    records: list[dict],
    db: Session = Depends(get_db),
):
    """Replace one workspace section with the records submitted by the admin UI."""
    validate_workspace_section(section)

    if len(records) > 1000:
        raise HTTPException(status_code=400, detail="A section cannot contain more than 1000 records.")

    prepared_records = []
    seen_keys = set()

    for record in records:
        if not isinstance(record, dict):
            raise HTTPException(status_code=422, detail="Each record must be an object.")

        record_key = str(record.get("id", "")).strip()
        if not record_key or len(record_key) > 100:
            raise HTTPException(status_code=422, detail="Every record must have a valid id.")

        if record_key in seen_keys:
            raise HTTPException(status_code=422, detail="Duplicate record ids are not allowed.")

        seen_keys.add(record_key)
        data = {key: value for key, value in record.items() if key != "id"}
        prepared_records.append(
            models.WorkspaceRecord(
                section=section,
                record_key=record_key,
                data=data,
            )
        )

    try:
        db.query(models.WorkspaceRecord).filter(
            models.WorkspaceRecord.section == section
        ).delete(synchronize_session=False)

        db.add_all(prepared_records)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not save workspace records.")

    return [
        {"id": record.record_key, **record.data}
        for record in prepared_records
    ]
