import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchLeads,
  approveLead,
  rejectLead,
  ingestLead,
} from "../api/client";
import type { Lead, LeadIngestPayload } from "../types/lead";
import { TopBar } from "../components/TopBar";
import {
  LeadQueueSidebar,
  type FilterTab,
} from "../components/LeadQueueSidebar";
import { LeadContextPane } from "../components/LeadContextPane";
import { ApprovalEditorPane } from "../components/ApprovalEditorPane";

const VALID_TABS: FilterTab[] = ["pending_approval", "sent", "rejected", "all"];

const DEMO_INBOUND_LEADS: LeadIngestPayload[] = [
  {
    prospect_name: "Elena Rostova",
    prospect_email: "elena@stackpulse.ai",
    prospect_role: "VP of Growth",
    company_name: "StackPulse AI",
    company_domain: "stackpulse.ai",
    company_size: "95 employees",
    industry: "DevOps & Cloud Infrastructure",
    monthly_ad_spend: "$25k/mo",
    matched_case_study:
      "CloudKube Systems — Lifted demo-to-close rate from 14% to 29%",
    enrichment_notes:
      "AI observability startup. Just launched enterprise tier; high intent on Google Search and technical comparison keywords.",
    inbound_message:
      "We're scaling enterprise pipeline after our Series A and want a B2B paid acquisition partner who understands technical DevOps buyers. Can you share how you structure 90-day engagements?",
    ai_draft_reply:
      "Hi Elena,\n\nCongrats on the Series A momentum at StackPulse AI! Technical DevOps positioning is right in our wheelhouse.\n\nWe recently helped CloudKube Systems align their technical comparison pages and ABM retargeting around VP Engineering pain points, lifting demo-to-close rate from 14% to 29%.\n\nOur retainers start at $6,500/month with a clear 90-day pipeline roadmap. Are you open to a quick 15-minute audit call this week?\n\nBest,\nAlex Rivera\nFounder, NorthStar Growth Partners",
    icp_score: 94,
  },
  {
    prospect_name: "Marcus Vance",
    prospect_email: "mvance@clearledger.io",
    prospect_role: "Head of Marketing",
    company_name: "ClearLedger",
    company_domain: "clearledger.io",
    company_size: "140 employees",
    industry: "FinTech & B2B Payments",
    monthly_ad_spend: "$35k/mo",
    matched_case_study:
      "LedgerSync Corp — Scaled enterprise CFO demos from 12 to 48/month",
    enrichment_notes:
      "Mid-market treasury automation platform. Strong ICP match—currently spending $35k/mo with under-optimized LinkedIn retargeting.",
    inbound_message:
      "Looking for an agency to overhaul our LinkedIn + Search funnel targeting mid-market CFOs and Controllers. Do you have FinTech case studies?",
    ai_draft_reply:
      "Hi Marcus,\n\nYes—B2B FinTech is one of our core verticals. For LedgerSync Corp, we built a combined Google Search + LinkedIn ABM funnel targeting mid-market finance leaders that scaled them from 12 to 48 qualified CFO demos per month.\n\nHappy to walk through the exact funnel breakdown on a quick 15-minute call—what does your calendar look like Thursday?\n\nBest,\nAlex Rivera\nFounder, NorthStar Growth Partners",
    icp_score: 92,
  },
];

export function ApprovalConsolePage() {
  const { tab, ticketNumber } = useParams<{
    tab?: string;
    ticketNumber?: string;
  }>();
  const navigate = useNavigate();

  const activeTab: FilterTab = VALID_TABS.includes(tab as FilterTab)
    ? (tab as FilterTab)
    : "pending_approval";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [draftText, setDraftText] = useState("");
  const [approverName, setApproverName] = useState("Alex Rivera (Founder)");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load all leads from FastAPI on mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await fetchLeads("all");
        if (isMounted) setLeads(data);
      } catch (err) {
        if (isMounted) {
          setBannerMessage({
            type: "error",
            text:
              err instanceof Error
                ? err.message
                : "Failed to connect to FastAPI backend on port 8000.",
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter leads by active route tab + search box
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesTab = activeTab === "all" || lead.status === activeTab;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        lead.prospect_name.toLowerCase().includes(q) ||
        lead.company_name.toLowerCase().includes(q) ||
        lead.ticket_number.toLowerCase().includes(q) ||
        lead.industry.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [leads, activeTab, searchQuery]);

  // Resolve currently selected lead from URL param or default to first in filtered list
  const selectedLead = useMemo(() => {
    if (filteredLeads.length === 0) return null;
    if (ticketNumber) {
      const match = filteredLeads.find((l) => l.ticket_number === ticketNumber);
      if (match) return match;
    }
    return filteredLeads[0];
  }, [filteredLeads, ticketNumber]);

  // Keep URL synced when default lead is auto-selected
  useEffect(() => {
    if (!isLoading && selectedLead && ticketNumber !== selectedLead.ticket_number) {
      navigate(`/leads/${activeTab}/${selectedLead.ticket_number}`, {
        replace: true,
      });
    }
  }, [isLoading, selectedLead, ticketNumber, activeTab, navigate]);

  // Sync editor textarea whenever selected lead changes
  useEffect(() => {
    if (selectedLead) {
      setDraftText(
        selectedLead.status === "sent" && selectedLead.final_sent_reply
          ? selectedLead.final_sent_reply
          : selectedLead.ai_draft_reply
      );
    } else {
      setDraftText("");
    }
  }, [selectedLead]);

  // TopBar KPI metrics
  const stats = useMemo(() => {
    const pending = leads.filter((l) => l.status === "pending_approval");
    const sent = leads.filter((l) => l.status === "sent");
    const avgIcp =
      leads.length > 0
        ? Math.round(
            leads.reduce((sum, l) => sum + l.icp_score, 0) / leads.length
          )
        : 0;
    return { pendingCount: pending.length, sentCount: sent.length, avgIcp };
  }, [leads]);

  const handleTabChange = (nextTab: FilterTab) => {
    navigate(`/leads/${nextTab}`);
  };

  const handleSelectLead = (lead: Lead) => {
    setBannerMessage(null);
    navigate(`/leads/${activeTab}/${lead.ticket_number}`);
  };

  const handleApprove = async () => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    setBannerMessage(null);
    try {
      const updated = await approveLead(selectedLead.id, {
        final_reply: draftText,
        approved_by: approverName,
      });
      setLeads((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setBannerMessage({
        type: "success",
        text: `Approved & dispatched reply for ${updated.ticket_number} (${updated.prospect_name}).`,
      });
    } catch (err) {
      setBannerMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to approve lead.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    setBannerMessage(null);
    try {
      const updated = await rejectLead(selectedLead.id);
      setLeads((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setBannerMessage({
        type: "success",
        text: `Archived ${updated.ticket_number} (${updated.company_name}).`,
      });
    } catch (err) {
      setBannerMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to reject lead.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateInbound = async () => {
    setIsSimulating(true);
    setBannerMessage(null);
    try {
      const template =
        DEMO_INBOUND_LEADS[leads.length % DEMO_INBOUND_LEADS.length];
      const uniqueSuffix = Math.floor(100 + Math.random() * 900);
      const created = await ingestLead({
        ...template,
        prospect_email: template.prospect_email.replace(
          "@",
          `+${uniqueSuffix}@`
        ),
      });
      setLeads((prev) => [created, ...prev]);
      navigate(`/leads/pending_approval/${created.ticket_number}`);
      setBannerMessage({
        type: "success",
        text: `New inbound lead ${created.ticket_number} (${created.company_name}) ingested into Needs Review.`,
      });
    } catch (err) {
      setBannerMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Failed to simulate inbound lead.",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 text-slate-900 overflow-hidden">
      <TopBar
        pendingCount={stats.pendingCount}
        sentCount={stats.sentCount}
        avgIcpScore={stats.avgIcp}
        isSimulating={isSimulating}
        onSimulateInbound={handleSimulateInbound}
      />

      {bannerMessage && (
        <div
          className={`px-6 py-2 text-xs font-medium flex items-center justify-between border-b ${
            bannerMessage.type === "success"
              ? "bg-emerald-600 text-white border-emerald-700"
              : "bg-rose-600 text-white border-rose-700"
          }`}
        >
          <span>{bannerMessage.text}</span>
          <button
            type="button"
            onClick={() => setBannerMessage(null)}
            className="underline opacity-90 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
          Loading NorthStar Ops queue...
        </div>
      ) : (
        <main className="flex-1 flex overflow-hidden">
          <LeadQueueSidebar
            leads={filteredLeads}
            selectedLeadId={selectedLead?.id ?? null}
            activeTab={activeTab}
            searchQuery={searchQuery}
            onSelectLead={handleSelectLead}
            onTabChange={handleTabChange}
            onSearchChange={setSearchQuery}
          />

          <LeadContextPane lead={selectedLead} />

          <ApprovalEditorPane
            lead={selectedLead}
            draftText={draftText}
            approverName={approverName}
            isSubmitting={isSubmitting}
            onDraftChange={setDraftText}
            onApproverChange={setApproverName}
            onResetDraft={() =>
              selectedLead && setDraftText(selectedLead.ai_draft_reply)
            }
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </main>
      )}
    </div>
  );
}