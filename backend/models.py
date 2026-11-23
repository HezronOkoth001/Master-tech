
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, UniqueConstraint
from sqlalchemy.sql import func

from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    status = Column(String(50), default="Completed", nullable=False)
    image_url = Column(String(500), nullable=True)
    project_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WorkspaceRecord(Base):
    __tablename__ = "workspace_records"
    __table_args__ = (
        UniqueConstraint("section", "record_key", name="uq_workspace_section_record"),
    )

    id = Column(Integer, primary_key=True, index=True)
    section = Column(String(30), nullable=False, index=True)
    record_key = Column(String(100), nullable=False)
    data = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
