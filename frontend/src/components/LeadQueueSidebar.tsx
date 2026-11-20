import { Search, Building2 } from "lucide-react";
import type { Lead } from "../types/lead";

export type FilterTab = "pending_approval" | "sent" | "rejected" | "all";

interface LeadQueueSidebarProps {
  leads: Lead[];
  selectedLeadId: string | null;
  activeTab: FilterTab;
  searchQuery: string;
  onSelectLead: (lead: Lead) => void;
  onTabChange: (tab: FilterTab) => void;
  onSearchChange: (query: string) => void;
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: "pending_approval", label: "Needs Review" },
  { id: "sent", label: "Sent" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

function getIcpBadgeColor(score: number): string {
  if (score >= 92) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 85) return "bg-indigo-50 text-indigo-700 border-indigo-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export function LeadQueueSidebar({
  leads,
  selectedLeadId,
  activeTab,
  searchQuery,
  onSelectLead,
  onTabChange,
  onSearchChange,
}: LeadQueueSidebarProps) {
  return (
    <aside className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Filter Tabs */}
      <div className="p-3 border-b border-slate-200 space-y-2.5">
        <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`py-1.5 px-2 rounded-md text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prospect, company, ticket..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Lead Cards List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {leads.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No leads match this filter.
          </div>
        ) : (
          leads.map((lead) => {
            const isSelected = lead.id === selectedLeadId;
            return (
              <button
                key={lead.id}
                type="button"
                onClick={() => onSelectLead(lead)}
                className={`w-full text-left p-4 transition cursor-pointer block ${
                  isSelected
                    ? "bg-indigo-50/70 border-l-4 border-l-indigo-600"
                    : "hover:bg-slate-50 border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-mono font-medium text-slate-500">
                    {lead.ticket_number}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getIcpBadgeColor(
                      lead.icp_score
                    )}`}
                  >
                    {lead.icp_score}% ICP
                  </span>
                </div>

                <div className="font-semibold text-sm text-slate-900 truncate">
                  {lead.prospect_name}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {lead.company_name} · {lead.prospect_role}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                  {lead.inbound_message}
                </p>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="truncate max-w-[65%]">{lead.industry}</span>
                  {lead.monthly_ad_spend && (
                    <span className="font-medium text-slate-700">
                      {lead.monthly_ad_spend}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}