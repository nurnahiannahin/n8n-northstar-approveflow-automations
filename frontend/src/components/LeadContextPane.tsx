import {
  Mail,
  Globe,
  Users,
  DollarSign,
  Briefcase,
  Sparkles,
  Award,
  MessageSquare,
} from "lucide-react";
import type { Lead } from "../types/lead";

interface LeadContextPaneProps {
  lead: Lead | null;
}

export function LeadContextPane({ lead }: LeadContextPaneProps) {
  if (!lead) {
    return (
      <section className="flex-1 bg-slate-50 flex items-center justify-center p-8 text-sm text-slate-500">
        Select a lead from the queue to inspect enrichment context and inbound message.
      </section>
    );
  }

  return (
    <section className="flex-1 bg-slate-50 overflow-y-auto p-6 space-y-5 border-r border-slate-200">
      {/* Prospect & Company Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {lead.ticket_number}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(lead.created_at).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1.5">
              {lead.prospect_name}
            </h2>
            <p className="text-sm text-slate-600">
              {lead.prospect_role} at{" "}
              <span className="font-semibold text-slate-800">{lead.company_name}</span>
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">ICP Fit Score</div>
            <div className="text-2xl font-bold text-emerald-600">{lead.icp_score}%</div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{lead.prospect_email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{lead.company_domain}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{lead.company_size}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Ad Spend: {lead.monthly_ad_spend || "Not disclosed"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 col-span-2">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{lead.industry}</span>
          </div>
        </div>
      </div>

      {/* Inbound Prospect Message */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          Inbound Inquiry
        </div>
        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
          {lead.inbound_message}
        </p>
      </div>

      {/* AI Enrichment Intelligence */}
      <div className="bg-amber-50/70 rounded-xl border border-amber-200/80 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Enrichment & Account Intel
        </div>
        <p className="text-xs text-amber-950 leading-relaxed">{lead.enrichment_notes}</p>
      </div>

      {/* Grounded Case Study Match */}
      <div className="bg-indigo-50/70 rounded-xl border border-indigo-200/80 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-800 mb-2">
          <Award className="w-4 h-4 text-indigo-600" />
          Matched Agency Proof Point
        </div>
        <p className="text-xs font-medium text-indigo-950 leading-relaxed">
          {lead.matched_case_study}
        </p>
      </div>
    </section>
  );
}