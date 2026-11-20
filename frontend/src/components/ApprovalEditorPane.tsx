import { Send, XCircle, RotateCcw, CheckCircle2, UserCheck } from "lucide-react";
import type { Lead } from "../types/lead";

interface ApprovalEditorPaneProps {
  lead: Lead | null;
  draftText: string;
  approverName: string;
  isSubmitting: boolean;
  onDraftChange: (value: string) => void;
  onApproverChange: (value: string) => void;
  onResetDraft: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const APPROVERS = [
  "Alex Rivera (Founder)",
  "Maya Lin (Head of Growth)",
  "Jordan Vance (Account Director)",
];

export function ApprovalEditorPane({
  lead,
  draftText,
  approverName,
  isSubmitting,
  onDraftChange,
  onApproverChange,
  onResetDraft,
  onApprove,
  onReject,
}: ApprovalEditorPaneProps) {
  if (!lead) {
    return (
      <section className="w-[420px] xl:w-[480px] bg-white flex items-center justify-center p-8 text-sm text-slate-400 shrink-0">
        No draft loaded.
      </section>
    );
  }

  const isPending = lead.status === "pending_approval";
  const isSent = lead.status === "sent";
  const hasEdits = draftText.trim() !== lead.ai_draft_reply.trim();
  const wordCount = draftText.trim() ? draftText.trim().split(/\s+/).length : 0;

  return (
    <section className="w-[420px] xl:w-[480px] bg-white flex flex-col shrink-0">
      {/* Editor Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {isPending ? "Human-in-the-Loop Reply Gate" : "Audit Record"}
          </h3>
          <p className="text-xs text-slate-500">
            To: <span className="font-medium text-slate-700">{lead.prospect_email}</span>
          </p>
        </div>

        {isPending && hasEdits && (
          <button
            type="button"
            onClick={onResetDraft}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-indigo-600 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset AI Draft
          </button>
        )}
      </div>

      {/* Status Banner for Already-Processed Leads */}
      {!isPending && (
        <div
          className={`mx-5 mt-4 p-3 rounded-lg border text-xs flex items-center gap-2 ${
            isSent
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {isSent ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Approved & dispatched by{" "}
                <strong>{lead.approved_by || "Team Member"}</strong>
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Inquiry rejected and archived from outbound queue.</span>
            </>
          )}
        </div>
      )}

      {/* Editable Email Body */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>
            Subject:{" "}
            <strong className="text-slate-700">
              Re: {lead.company_name} x NorthStar Growth Partners
            </strong>
          </span>
          <span>{wordCount} words</span>
        </div>

        <textarea
          value={isSent && lead.final_sent_reply ? lead.final_sent_reply : draftText}
          onChange={(e) => onDraftChange(e.target.value)}
          disabled={!isPending || isSubmitting}
          rows={14}
          className="flex-1 w-full p-4 text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-80 disabled:bg-slate-100 resize-none font-sans"
          placeholder="Review and refine the AI-generated outbound response..."
        />
      </div>

      {/* Approval Controls Footer */}
      {isPending && (
        <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <UserCheck className="w-4 h-4 text-slate-400" />
              Approving as:
            </label>
            <select
              value={approverName}
              onChange={(e) => onApproverChange(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {APPROVERS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onReject}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-50 inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>

            <button
              type="button"
              onClick={onApprove}
              disabled={isSubmitting || draftText.trim().length < 10}
              className="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Dispatching..." : "Approve & Send Reply"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}