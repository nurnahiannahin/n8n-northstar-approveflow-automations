import { Link } from "react-router-dom";
import { Sparkles, Plus, ShieldCheck, ExternalLink } from "lucide-react";

interface TopBarProps {
  pendingCount: number;
  sentCount: number;
  avgIcpScore: number;
  isSimulating: boolean;
  onSimulateInbound: () => void;
}

export function TopBar({
  pendingCount,
  sentCount,
  avgIcpScore,
  isSimulating,
  onSimulateInbound,
}: TopBarProps) {
  return (
    <header className="h-16 bg-slate-950 text-white border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-base tracking-tight">NorthStar Ops</h1>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ApproveFlow AI
            </span>
          </div>
          <p className="text-xs text-slate-400">B2B Agency Human-in-the-Loop Console</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-400">Needs Review:</span>
            <span className="font-semibold text-white">{pendingCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Approved & Sent:</span>
            <span className="font-semibold text-white">{sentCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Avg ICP Fit:</span>
            <span className="font-semibold text-white">{avgIcpScore}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/inquire"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          >
            Public Form
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={onSimulateInbound}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {isSimulating ? "Ingesting..." : "Simulate Inbound Lead"}
          </button>
        </div>
      </div>
    </header>
  );
}