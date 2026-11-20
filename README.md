# NorthStar Ops — ApproveFlow AI 🤖

**An AI-Powered Inbound Lead Triage & Human-in-the-Loop Approval CRM.**

NorthStar Ops bridges the gap between **24/7 AI response speed** and **human brand safety**. Instead of letting an LLM send unreviewed emails to high-value prospects—or forcing teams to manually write every reply from scratch—ApproveFlow AI automatically researches, scores, and drafts tailored responses, holding them in a clean review queue until an operator clicks **Approve & Send**.

🎥 **[Watch the quick Architecture & Live Demo Walkthrough](https://www.loom.com/share/ced4041171dd4f229b03f27da0a8e5a1)**

---

## 🚨 The Problem
* **Slow Follow-Up:** Agencies and B2B teams lose warm deals when inbound leads wait hours for a reply.
* **Unchecked AI Risk:** Letting autonomous AI agents email prospects directly risks hallucinations, off-brand messaging, and broken trust.

## 💡 The Solution
1. **Instant AI Triage (`n8n` + `OpenAI`):** Captures incoming leads, normalizes payload data, backs up raw records, scores ICP fit, matches relevant case studies, and generates a structured JSON email draft.
2. **Human-in-the-Loop CRM (`React` + `TypeScript` + `FastAPI`):** Routes drafted replies into a dedicated `Needs Review` dashboard where team members can inspect lead context, edit copy, or reject low-fit submissions.
3. **One-Click Verified Dispatch (`n8n` + `Gmail API`):** Approving a draft triggers a secondary webhook that sends the verified email via Gmail and updates the CRM audit log in real time.

---

## 🏗️ System Architecture

```text
[Lead Intake Form]
       │
       ▼
[n8n Flow 1: Ingestion & AI Triage]
  ├── Normalize Lead Fields
  ├── Backup Raw Lead (Google Sheets)
  ├── AI Agent (OpenAI + Structured JSON Output Parser)
  └── POST /api/leads/ingest ──► [FastAPI + PostgreSQL]
                                         │
                                         ▼
                           [NorthStar Ops CRM (React + TS)]
                            (Operator Reviews & Edits Draft)
                                         │
                             Clicks "Approve & Send"
                                         │
                                         ▼
                        [n8n Flow 2: Approved Dispatch]
                          └── Sends Verified Email (Gmail API)
```

---

## ✨ Key Features
* **Automated ICP Scoring & Case Study Matching:** Evaluates prospect fit and pairs the reply with the most relevant proof of work.
* **Structured Output Enforcement:** Uses n8n's Structured Output Parser to guarantee reliable JSON payloads between the LLM and backend API.
* **Dual-Pipeline Separation:** Decouples **Lead Ingestion** from **Email Dispatch** so outbound messages are physically impossible to send without human approval.
* **Full Audit & Status Tracking:** Tracks leads across lifecycle stages (`pending_approval`, `approved_sent`, `rejected`) in PostgreSQL.
* **Raw Lead Redundancy:** Automatically logs every inbound form submission to Google Sheets prior to AI processing.

---

## ⚙️ Tech Stack
* **Orchestration & Automation:** n8n (Dual-Workflow Architecture, Webhooks, AI Agent, Structured Output Parser)
* **AI / LLM:** OpenAI Chat Model
* **Frontend:** React, TypeScript, Vite
* **Backend:** FastAPI (Python)
* **Database:** PostgreSQL
* **Integrations:** Gmail API, Google Sheets API

---

## 📂 Repository Structure

```text
northstar-ops-approveflow-ai/
├── frontend/               # React + TypeScript + Vite CRM Dashboard
├── backend/                # FastAPI REST API & Database Models
├── n8n/                    # Exported n8n Workflow JSON Files
│   ├── flow1-lead-ingestion.json
│   └── flow2-approval-dispatch.json
├── .env.example            # Environment Variable Template
└── README.md
```

---

## 🚀 Local Setup & Installation

### 1. Clone the Repository
```bash
git clone [https://github.com/nurnahiannahin/northstar-ops-approveflow-ai.git](https://github.com/nurnahiannahin/northstar-ops-approveflow-ai.git)
cd northstar-ops-approveflow-ai
```

### 2. Import n8n Workflows
1. Open your n8n instance (Cloud or local Docker via `n8nio/n8n`).
2. Import `n8n/flow1-lead-ingestion.json` and `n8n/flow2-approval-dispatch.json`.
3. Connect your **OpenAI**, **Google Sheets**, and **Gmail OAuth2** credentials.
4. Copy the active webhook URLs for both flows.

### 3. Configure & Run Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env   # Add your DATABASE_URL and N8N_APPROVAL_WEBHOOK_URL
uvicorn main:app --reload --port 8000
```

### 4. Configure & Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Security & Credential Hygiene
* All API keys, OAuth tokens, and webhook URLs are excluded from version control via `.gitignore` and `.env`.
* Exported n8n `.json` workflow files contain structural node definitions only—no sensitive credentials are stored in this repository.

---

## 👤 Author
Built by **Nur Nahian Nahin** — AI Automation & Full-Stack Workflow Builder.  
*Connect on [LinkedIn](https://www.linkedin.com/) to discuss AI agents, n8n systems, and internal agency tools.*
