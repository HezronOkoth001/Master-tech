
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import Base, engine, SessionLocal
import models

app = FastAPI(
    title="Masters Tech API",
    description="Backend API for the Masters Tech business platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
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
def health_check():
    return {"status": "healthy"}


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
