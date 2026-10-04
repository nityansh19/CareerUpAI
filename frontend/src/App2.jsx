import { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import WorkspaceShell from "./workspace/WorkspaceShell";
import { getStoredUser } from "./auth/session";
import { refreshCloudUser } from "./lib/workspace";
import AppBoundary from "./components/AppBoundary";
import PerformanceStyles from "./performance/PerformanceStyles";
const Home3D = lazy(() => import("./Home3D"));
const WebGLExperience = lazy(() => import("./WebGLExperience"));
const PublicPage = lazy(() =>
  import("./PublicPages").then((m) => ({ default: m.PublicPage })),
);
const HomeDashboard = lazy(() => import("./workspace/HomeDashboard"));
const AuthPage = lazy(() => import("./auth/AuthPage"));
const Onboarding = lazy(() => import("./auth/Onboarding"));
const ResumePage = lazy(() => import("./workspace/ResumePage"));
const CareerPage = lazy(() => import("./workspace/CareerPage"));
const SkillsPage = lazy(() => import("./workspace/SkillsPage"));
const ProfilePage = lazy(() => import("./workspace/ProfilePage"));
const JobsPage = lazy(() => import("./workspace/JobsPage"));
const InterviewPage = lazy(() => import("./workspace/InterviewPage"));
const SettingsPage = lazy(() => import("./workspace/SettingsPage"));
const titles = {
  "/": "Career intelligence for your next move",
  "/dashboard": "Your workspace",
  "/resume-intelligence": "Resume review",
  "/career-intelligence": "Career paths",
  "/skills": "Learning plan",
  "/jobs": "Application tracker",
  "/interview": "Interview practice",
  "/profile": "Your profile",
  "/settings": "Settings",
  "/login": "Sign in",
  "/register": "Create account",
  "/onboarding": "Make it yours",
};
function RouteEffects() {
  const location = useLocation(),
    navigate = useNavigate();
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
    document.title = `${titles[location.pathname] || location.pathname.slice(1)} · CareerUpAI`;
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const expire = () =>
      navigate("/login", { state: { from: location.pathname }, replace: true });
    window.addEventListener("careerup:session-expired", expire);
    return () => window.removeEventListener("careerup:session-expired", expire);
  }, [navigate, location.pathname]);
  return null;
}
function WorkspaceRoute({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(() => getStoredUser()),
    [loading, setLoading] = useState(
      () => getStoredUser()?.authMode === "cloud",
    ),
    [error, setError] = useState("");
  useEffect(() => {
    const refresh = () => setUser(getStoredUser());
    window.addEventListener("careerup:user-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("careerup:user-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  useEffect(() => {
    let active = true;
    if (user?.authMode === "cloud")
      refreshCloudUser()
        .then((next) => {
          if (active) setUser(next);
        })
        .catch((e) => {
          if (active) setError(e.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    return () => {
      active = false;
    };
  }, [user?.authMode]);
  if (!user)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return (
    <WorkspaceShell user={user}>
      {error && (
        <p className="ws-message" role="alert">
          {error}
        </p>
      )}
      {loading ? <Loading /> : children}
    </WorkspaceShell>
  );
}
function Guest({ children }) {
  return getStoredUser() ? <Navigate to="/dashboard" replace /> : children;
}
function Loading() {
  return (
    <div className="ws-loading" role="status">
      <span />
      Opening your career workspace…
    </div>
  );
}
function ProductRoute({ type, children }) {
  return getStoredUser() ? (
    <WorkspaceRoute>{children}</WorkspaceRoute>
  ) : (
    <PublicPage type={type} />
  );
}
export default function App2() {
  return (
    <AppBoundary>
      <BrowserRouter>
        <RouteEffects />
        <PerformanceStyles />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="relative isolate">
                  <WebGLExperience />
                  <Home3D />
                </div>
              }
            />
            {[
              "product",
              "roadmaps",
              "pricing",
              "about",
              "privacy",
              "terms",
            ].map((type) => (
              <Route
                key={type}
                path={`/${type}`}
                element={<PublicPage type={type} />}
              />
            ))}
            <Route
              path="/login"
              element={
                <Guest>
                  <AuthPage />
                </Guest>
              }
            />
            <Route
              path="/register"
              element={
                <Guest>
                  <AuthPage register />
                </Guest>
              }
            />
            <Route
              path="/onboarding"
              element={
                <WorkspaceRoute>
                  <Onboarding />
                </WorkspaceRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <WorkspaceRoute>
                  <HomeDashboard />
                </WorkspaceRoute>
              }
            />
            <Route
              path="/resume-intelligence"
              element={
                <ProductRoute type="resume">
                  <ResumePage />
                </ProductRoute>
              }
            />
            <Route
              path="/career-intelligence"
              element={
                <ProductRoute type="intelligence">
                  <CareerPage />
                </ProductRoute>
              }
            />
            {[
              ["jobs", JobsPage],
              ["interview", InterviewPage],
              ["skills", SkillsPage],
              ["profile", ProfilePage],
              ["settings", SettingsPage],
            ].map(([path, Page]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <WorkspaceRoute>
                    <Page />
                  </WorkspaceRoute>
                }
              />
            ))}
            <Route
              path="*"
              element={
                <main className="ws-fallback">
                  <h1>This page hasn’t been mapped.</h1>
                  <p>Head back to your career workspace.</p>
                  <a
                    className="ws-btn ws-btn-primary"
                    href={getStoredUser() ? "/dashboard" : "/"}
                  >
                    Go home
                  </a>
                </main>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppBoundary>
  );
}
