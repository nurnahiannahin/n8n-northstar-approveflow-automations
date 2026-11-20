import type {
  Lead,
  LeadApprovePayload,
  LeadIngestPayload,
  CaseStudy,
} from "../types/lead";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const N8N_INBOUND_WEBHOOK_URL =
  import.meta.env.VITE_N8N_INBOUND_WEBHOOK_URL ||
  "https://nur527.app.n8n.cloud/webhook-test/Human-in-the-Loop Lead Reply System (NorthStar Ops)";

export interface RawInquiryPayload {
  prospect_name: string;
  prospect_email: string;
  prospect_role: string;
  company_name: string;
  company_domain: string;
  company_size: string;
  industry: string;
  monthly_ad_spend: string;
  inbound_message: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail
          .map((err: { msg?: string }) => err.msg || "Validation error")
          .join(", ");
      }
    } catch {
      // Fallback to default status error message if response body is not JSON
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

export async function submitInquiryToN8n(
  payload: RawInquiryPayload
): Promise<void> {
  const response = await fetch(N8N_INBOUND_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `n8n Webhook error (${response.status})`;
    try {
      const text = await response.text();
      if (text) errorMessage += `: ${text}`;
    } catch {
      // Ignore body parse errors
    }
    throw new Error(errorMessage);
  }
}

export async function fetchLeads(status?: string): Promise<Lead[]> {
  const query =
    status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
  const response = await fetch(`${API_BASE_URL}/leads${query}`);
  return handleResponse<Lead[]>(response);
}

export async function approveLead(
  leadId: string,
  payload: LeadApprovePayload
): Promise<Lead> {
  const response = await fetch(`${API_BASE_URL}/leads/${leadId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Lead>(response);
}

export async function rejectLead(leadId: string): Promise<Lead> {
  const response = await fetch(`${API_BASE_URL}/leads/${leadId}/reject`, {
    method: "POST",
  });
  return handleResponse<Lead>(response);
}

export async function ingestLead(payload: LeadIngestPayload): Promise<Lead> {
  const response = await fetch(`${API_BASE_URL}/leads/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Lead>(response);
}

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  const response = await fetch(`${API_BASE_URL}/case-studies`);
  return handleResponse<CaseStudy[]>(response);
}