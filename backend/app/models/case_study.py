import uuid
from sqlalchemy import Column, String, Text
from app.core.database import Base


class CaseStudy(Base):
    __tablename__ = "case_studies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    vertical = Column(String, unique=True, nullable=False)
    client_highlight = Column(String, nullable=False)
    result_metric = Column(Text, nullable=False)