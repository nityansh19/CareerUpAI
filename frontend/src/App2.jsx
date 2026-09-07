import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home3D from "./Home3D";
import WebGLExperience from "./WebGLExperience";
import ProductionCopy from "./ProductionCopy";
import { PublicPage } from "./PublicPages";
import ResumeIntelligence from "./ResumeIntelligence";
import CareerIntelligence from "./CareerIntelligence";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./Dashboard/Dashboard";

function LandingPage() {
  return (
    <div className="relative isolate">
      <ProductionCopy />
      <WebGLExperience />
      <Home3D />
    </div>
  );
}

function ResumeRoute() {
  const hasUser = Boolean(localStorage.getItem("user"));
  return hasUser ? <ResumeIntelligence /> : <PublicPage type="resume" />;
}

function CareerIntelligenceRoute() {
  const hasUser = Boolean(localStorage.getItem("user"));
  return hasUser ? <CareerIntelligence /> : <PublicPage type="intelligence" />;
}

export default function App2() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<PublicPage type="product" />} />
        <Route path="/resume-intelligence" element={<ResumeRoute />} />
        <Route path="/career-intelligence" element={<CareerIntelligenceRoute />} />
        <Route path="/roadmaps" element={<PublicPage type="roadmaps" />} />
        <Route path="/pricing" element={<PublicPage type="pricing" />} />
        <Route path="/about" element={<PublicPage type="about" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
