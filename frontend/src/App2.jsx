import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home3D from "./Home3D";
import WebGLExperience from "./WebGLExperience";
import ProductionCopy from "./ProductionCopy";
import { PublicPage } from "./PublicPages";
import ResumeIntelligence from "./ResumeIntelligence";
import CareerIntelligence from "./CareerIntelligence";
import LoginLocal from "./auth/LoginLocal";
import RegisterLocal from "./auth/RegisterLocal";
import Dashboard from "./Dashboard/Dashboard";
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

function ProtectedRoute({ children }) {
  return getStoredUser() ? children : <Navigate to="/login" replace />;
}

function GuestOnlyRoute({ children }) {
  return getStoredUser() ? <Navigate to="/dashboard" replace /> : children;
}

function ResumeRoute() {
  return getStoredUser() ? <ResumeIntelligence /> : <PublicPage type="resume" />;
}

function CareerIntelligenceRoute() {
  return getStoredUser() ? <CareerIntelligence /> : <PublicPage type="intelligence" />;
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
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
