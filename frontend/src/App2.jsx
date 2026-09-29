import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home3D from "./Home3D";
import WebGLExperience from "./WebGLExperience";
import ProductionCopy from "./ProductionCopy";
import { PublicPage } from "./PublicPages";
import WorkspaceShell from "./workspace/WorkspaceShell";
import HomeDashboard from "./workspace/HomeDashboard";
import { CareerPage, ResumePage } from "./workspace/IntelligencePages";
import { InterviewPage, JobsPage, ProfilePage, SettingsPage, SkillsPage } from "./workspace/ModulePages";
import LoginLocal from "./auth/LoginLocal";
import RegisterLocal from "./auth/RegisterLocal";
import { getStoredUser } from "./auth/session";
import PerformanceStyles from "./performance/PerformanceStyles";

function LandingPage() {
  return (
    <div className="relative isolate">
      <ProductionCopy />
      <WebGLExperience />
      <Home3D />
    </div>
  );
}

function GuestOnlyRoute({ children }) {
  const user = getStoredUser();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function WorkspaceRoute({ children }) {
  const user = getStoredUser();
  if (!user) return <Navigate to="/login" replace />;
  return <WorkspaceShell user={user}>{children}</WorkspaceShell>;
}

function ResumeRoute() {
  const user = getStoredUser();
  if (!user) return <PublicPage type="resume" />;
  return <WorkspaceRoute><ResumePage /></WorkspaceRoute>;
}

function CareerIntelligenceRoute() {
  const user = getStoredUser();
  if (!user) return <PublicPage type="intelligence" />;
  return <WorkspaceRoute><CareerPage /></WorkspaceRoute>;
}

export default function App2() {
  return (
    <BrowserRouter>
      <PerformanceStyles />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<PublicPage type="product" />} />
        <Route path="/resume-intelligence" element={<ResumeRoute />} />
        <Route path="/career-intelligence" element={<CareerIntelligenceRoute />} />
        <Route path="/roadmaps" element={<PublicPage type="roadmaps" />} />
        <Route path="/pricing" element={<PublicPage type="pricing" />} />
        <Route path="/about" element={<PublicPage type="about" />} />
        <Route path="/login" element={<GuestOnlyRoute><LoginLocal /></GuestOnlyRoute>} />
        <Route path="/register" element={<GuestOnlyRoute><RegisterLocal /></GuestOnlyRoute>} />
        <Route path="/onboarding" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<WorkspaceRoute><HomeDashboard /></WorkspaceRoute>} />
        <Route path="/jobs" element={<WorkspaceRoute><JobsPage /></WorkspaceRoute>} />
        <Route path="/interview" element={<WorkspaceRoute><InterviewPage /></WorkspaceRoute>} />
        <Route path="/skills" element={<WorkspaceRoute><SkillsPage /></WorkspaceRoute>} />
        <Route path="/profile" element={<WorkspaceRoute><ProfilePage /></WorkspaceRoute>} />
        <Route path="/settings" element={<WorkspaceRoute><SettingsPage /></WorkspaceRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
