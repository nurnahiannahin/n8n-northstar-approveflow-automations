import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, DateTime
from app.core.database import Base


class Lead(Base):
    __tablename__ = "leads"

    # Identity & Queue Status
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_number = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default="pending_approval", index=True)  # pending_approval | sent | rejected

    # Prospect & Company Enrichment
    prospect_name = Column(String, nullable=False)
    prospect_email = Column(String, index=True, nullable=False)
    prospect_role = Column(String, default="Decision Maker")
    company_name = Column(String, nullable=False)
    company_domain = Column(String, nullable=False)
    company_size = Column(String, default="50-200 employees")
    industry = Column(String, default="B2B SaaS")
    monthly_ad_spend = Column(String, nullable=True)

    # AI Context & Draft Output
    icp_score = Column(Integer, default=90)
    matched_case_study = Column(String, nullable=False)
    enrichment_notes = Column(Text, nullable=False)
    inbound_message = Column(Text, nullable=False)
    ai_draft_reply = Column(Text, nullable=False)

    # Human Approval & Audit Trail
    final_sent_reply = Column(Text, nullable=True)
    approved_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )