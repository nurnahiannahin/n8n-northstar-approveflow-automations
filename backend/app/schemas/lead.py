from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class LeadIngest(BaseModel):
    prospect_name: str = Field(..., min_length=1, max_length=120)
    prospect_email: EmailStr
    prospect_role: str = "VP of Marketing"
    company_name: str = Field(..., min_length=1, max_length=120)
    company_domain: str = Field(..., min_length=2, max_length=120)
    company_size: str = "50-200 employees"
    industry: str = "B2B SaaS"
    monthly_ad_spend: Optional[str] = None
    matched_case_study: str = "B2B SaaS Paid Pipeline Engine"
    enrichment_notes: str = Field(..., min_length=5)
    inbound_message: str = Field(..., min_length=5)
    ai_draft_reply: str = Field(..., min_length=10)
    icp_score: int = Field(default=90, ge=0, le=100)


class LeadApprove(BaseModel):
    final_reply: str = Field(..., min_length=10)
    approved_by: str = Field(default="Alex Rivera (Founder)", min_length=2, max_length=100)


class LeadResponse(BaseModel):
    id: str
    ticket_number: str
    prospect_name: str
    prospect_email: str
    prospect_role: str
    company_name: str
    company_domain: str
    company_size: str
    industry: str
    monthly_ad_spend: Optional[str]
    matched_case_study: str
    enrichment_notes: str
    inbound_message: str
    ai_draft_reply: str
    final_sent_reply: Optional[str]
    icp_score: int
    status: str
    approved_by: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)