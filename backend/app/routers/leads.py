import random
import httpx
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models import Lead
from app.schemas import LeadIngest, LeadApprove, LeadResponse

router = APIRouter(prefix="/api/leads", tags=["Leads"])


@router.get("", response_model=list[LeadResponse])
def list_leads(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Lead)
    if status and status != "all":
        query = query.filter(Lead.status == status)
    return query.order_by(Lead.icp_score.desc(), Lead.created_at.desc()).all()


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: str, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.post("/ingest", response_model=LeadResponse)
def ingest_lead(payload: LeadIngest, db: Session = Depends(get_db)):
    # Deduplication guard: prevent duplicate open tickets for the same prospect email
    existing = (
        db.query(Lead)
        .filter(
            Lead.prospect_email == payload.prospect_email,
            Lead.status == "pending_approval",
        )
        .first()
    )
    if existing:
        return existing

    # Ensure unique human-readable ticket number
    ticket_number = f"NS-{random.randint(1050, 9999)}"
    while db.query(Lead).filter(Lead.ticket_number == ticket_number).first():
        ticket_number = f"NS-{random.randint(1050, 9999)}"

    lead = Lead(
        ticket_number=ticket_number,
        prospect_name=payload.prospect_name,
        prospect_email=payload.prospect_email,
        prospect_role=payload.prospect_role,
        company_name=payload.company_name,
        company_domain=payload.company_domain,
        company_size=payload.company_size,
        industry=payload.industry,
        monthly_ad_spend=payload.monthly_ad_spend,
        matched_case_study=payload.matched_case_study,
        enrichment_notes=payload.enrichment_notes,
        inbound_message=payload.inbound_message,
        ai_draft_reply=payload.ai_draft_reply,
        icp_score=payload.icp_score,
        status="pending_approval",
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@router.post("/{lead_id}/approve", response_model=LeadResponse)
async def approve_and_send(lead_id: str, payload: LeadApprove, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead.final_sent_reply = payload.final_reply
    lead.approved_by = payload.approved_by
    lead.status = "sent"
    db.commit()
    db.refresh(lead)

    # Trigger n8n dispatch webhook only when configured in .env
    if settings.N8N_DISPATCH_WEBHOOK_URL:
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                await client.post(
                    settings.N8N_DISPATCH_WEBHOOK_URL,
                    json={
                        "lead_id": lead.id,
                        "ticket_number": lead.ticket_number,
                        "to_email": lead.prospect_email,
                        "prospect_name": lead.prospect_name,
                        "company_name": lead.company_name,
                        "subject": f"Re: {lead.company_name} x NorthStar Growth Partners",
                        "body": lead.final_sent_reply,
                    },
                )
        except Exception:
            pass

    return lead


@router.post("/{lead_id}/reject", response_model=LeadResponse)
def reject_lead(lead_id: str, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead.status = "rejected"
    db.commit()
    db.refresh(lead)
    return lead