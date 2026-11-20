import { Navigate, Route, Routes } from "react-router-dom";
import { ApprovalConsolePage } from "./pages/ApprovalConsolePage";
import { AgencyLandingPage } from "./pages/AgencyLandingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/leads/pending_approval" replace />} />
      <Route path="/inquire" element={<AgencyLandingPage />} />
      <Route path="/leads/:tab" element={<ApprovalConsolePage />} />
      <Route path="/leads/:tab/:ticketNumber" element={<ApprovalConsolePage />} />
      <Route path="*" element={<Navigate to="/leads/pending_approval" replace />} />
    </Routes>
  );
}