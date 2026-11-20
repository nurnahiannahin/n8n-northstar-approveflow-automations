export type LeadStatus = "pending_approval" | "sent" | "rejected";

export interface Lead {
  id: string;
  ticket_number: string;
  prospect_name: string;
  prospect_email: string;
  prospect_role: string;
  company_name: string;
  company_domain: string;
  company_size: string;
  industry: string;
  monthly_ad_spend: string | null;
  matched_case_study: string;
  enrichment_notes: string;
  inbound_message: string;
  ai_draft_reply: string;
  final_sent_reply: string | null;
  icp_score: number;
  status: LeadStatus;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadApprovePayload {
  final_reply: string;
  approved_by: string;
}

export interface LeadIngestPayload {
  prospect_name: string;
  prospect_email: string;
  prospect_role?: string;
  company_name: string;
  company_domain: string;
  company_size?: string;
  industry?: string;
  monthly_ad_spend?: string | null;
  matched_case_study?: string;
  enrichment_notes: string;
  inbound_message: string;
  ai_draft_reply: string;
  icp_score?: number;
}

export interface CaseStudy {
  id: string;
  vertical: string;
  client_highlight: string;
  result_metric: string;
}