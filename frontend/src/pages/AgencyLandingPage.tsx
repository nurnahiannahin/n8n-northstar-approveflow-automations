import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { submitInquiryToN8n } from "../api/client";

const INDUSTRIES = [
  "Logistics & Supply Chain SaaS",
  "FinTech & B2B Payments",
  "DevOps & Cloud Infrastructure",
  "B2B SaaS (General)",
];

export function AgencyLandingPage() {
  const [prospectName, setProspectName] = useState("");
  const [prospectEmail, setProspectEmail] = useState("");
  const [prospectRole, setProspectRole] = useState("VP of Marketing");
  const [companyName, setCompanyName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [companySize, setCompanySize] = useState("51-100 employees");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [monthlyAdSpend, setMonthlyAdSpend] = useState("$25k - $50k/mo");
  const [inboundMessage, setInboundMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submitInquiryToN8n({
        prospect_name: prospectName.trim(),
        prospect_email: prospectEmail.trim(),
        prospect_role: prospectRole.trim() || "Marketing Leader",
        company_name: companyName.trim(),
        company_domain: companyDomain.trim().replace(/^https?:\/\//, ""),
        company_size: companySize,
        industry,
        monthly_ad_spend: monthlyAdSpend,
        inbound_message: inboundMessage.trim(),
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reach n8n webhook. Click 'Listen for test event' in n8n first."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">
              NorthStar Growth Partners
            </span>
          </div>

          <Link
            to="/leads/pending_approval"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3.5 py-2 rounded-lg transition"
          >
            Open Ops Approval Console
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-6 pt-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            B2B SaaS Paid Acquisition & Pipeline Engineering
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Turn LinkedIn & Search Clicks Into Qualified Sales Demos.
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            We help Series A–C B2B software teams eliminate wasted ad spend,
            align CRM revenue attribution, and scale enterprise pipeline in 90
            days.
          </p>

          <div className="space-y-3.5 pt-2 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">
                  $480k+ Pipeline Added in 90 Days
                </strong>
                Average client lift after restructuring LinkedIn ABM & HubSpot
                offline conversion sync.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">
                  Senior-Led Strategy & Fast Audit
                </strong>
                Every inquiry is reviewed directly by our founding growth
                partners within hours.
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="inline-block text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                Sent to n8n AI Pipeline
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Inquiry Sent to n8n & Queued for Review
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                n8n caught the submission for <strong>{companyName}</strong>,
                generated an AI enrichment & tailored reply, and pushed it to{" "}
                <strong>NorthStar Ops</strong>.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/leads/pending_approval"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Open Ops Approval Console
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setProspectName("");
                    setProspectEmail("");
                    setCompanyName("");
                    setCompanyDomain("");
                    setInboundMessage("");
                  }}
                  className="px-4 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Request a 90-Day Pipeline Audit
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tell us about your current funnel—our team will prepare a
                  custom breakdown.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={prospectName}
                    onChange={(e) => setProspectName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={prospectEmail}
                    onChange={(e) => setProspectEmail(e.target.value)}
                    placeholder="sarah@acmesaas.io"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={prospectRole}
                    onChange={(e) => setProspectRole(e.target.value)}
                    placeholder="VP of Marketing"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme SaaS"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Company Domain *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyDomain}
                    onChange={(e) => setCompanyDomain(e.target.value)}
                    placeholder="acmesaas.io"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Industry Vertical
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Company Size
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="51-100 employees">51-100 employees</option>
                    <option value="101-500 employees">101-500 employees</option>
                    <option value="500+ employees">500+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Monthly Ad Spend
                  </label>
                  <select
                    value={monthlyAdSpend}
                    onChange={(e) => setMonthlyAdSpend(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Under $10k/mo">Under $10k/mo</option>
                    <option value="$10k - $25k/mo">$10k - $25k/mo</option>
                    <option value="$25k - $50k/mo">$25k - $50k/mo</option>
                    <option value="$50k+/mo">$50k+/mo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  What is your #1 pipeline or paid acquisition bottleneck? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={inboundMessage}
                  onChange={(e) => setInboundMessage(e.target.value)}
                  placeholder="We're spending $30k/mo on LinkedIn and Search, getting clicks, but demo-to-close rates have stalled..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 inline-flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isSubmitting ? "Sending to n8n..." : "Request Custom Pipeline Audit"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}