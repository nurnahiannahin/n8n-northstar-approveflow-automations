from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import CaseStudy
from app.schemas import CaseStudyResponse

router = APIRouter(prefix="/api/case-studies", tags=["Case Studies"])


@router.get("", response_model=list[CaseStudyResponse])
def list_case_studies(db: Session = Depends(get_db)):
    return db.query(CaseStudy).all()