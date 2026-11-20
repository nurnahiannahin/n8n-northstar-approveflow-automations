from sqlalchemy.orm import Session
from app.models import Lead, CaseStudy


def seed_demo_data(db: Session) -> None:
    # 1. Seed agency proof points if the case_studies table is empty
    if db.query(CaseStudy).count() == 0:
        studies = [
            CaseStudy(
                vertical="Logistics & Supply Chain SaaS",
                client_highlight="CargoFlow Technologies (Series A)",
                result_metric="Cut LinkedIn Ads cost-per-qualified-demo by 44% and added $480k in qualified pipeline in 90 days.",
            ),
            CaseStudy(
                vertical="FinTech & B2B Payments",
                client_highlight="LedgerSync Corp",
                result_metric="Scaled outbound + paid search demand engine from 12 to 48 enterprise CFO demos/month at $6,500/mo retainer.",
            ),
            CaseStudy(
                vertical="DevOps & Cloud Infrastructure",
                client_highlight="CloudKube Systems",
                result_metric="Rebuilt landing pages and ABM retargeting, lifting demo-to-close rate from 14% to 29%.",
            ),
        ]
        db.add_all(studies)

    # 2. Seed only the completed Marcus Sterling record if the leads table is empty
    if db.query(Lead).count() == 0:
        sample_leads = [
            Lead(
                ticket_number="NS-1040",
                prospect_name="Marcus Sterling",
                prospect_email="msterling@vectortrack.com",
                prospect_role="CRO",
                company_name="VectorTrack",
                company_domain="vectortrack.com",
                company_size="160 employees",
                industry="Logistics & Supply Chain SaaS",
                monthly_ad_spend="$45k/mo",
                matched_case_study="CargoFlow Technologies — Cut LinkedIn Ads CPL by 44% & added $480k pipeline in 90 days",
                enrichment_notes="Enterprise fleet telematics provider. Fast-tracked discovery call booked.",
                inbound_message=(
                    "Need an urgent Q1 demand-gen partner for our enterprise fleet product. "
                    "Available for an intro call this week?"
                ),
                ai_draft_reply=(
                    "Hi Marcus,\n\n"
                    "We'd love to help with VectorTrack's Q1 enterprise push—we specialize in fleet & supply-chain SaaS. "
                    "Does tomorrow at 2 PM CST work for a 15-minute intro call?\n\n"
                    "Best,\nAlex Rivera"
                ),
                final_sent_reply=(
                    "Hi Marcus,\n\n"
                    "We'd love to help with VectorTrack's Q1 enterprise push—we specialize in fleet & supply-chain SaaS. "
                    "Does tomorrow at 2 PM CST work for a 15-minute intro call?\n\n"
                    "Best,\nAlex Rivera"
                ),
                icp_score=95,
                status="sent",
                approved_by="Alex Rivera (Founder)",
            ),
        ]
        db.add_all(sample_leads)

    db.commit()