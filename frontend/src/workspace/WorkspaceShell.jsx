import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearStoredUser, getStoredUser } from "../auth/session";
import "./workspace.css";
import MotionRegion from "../components/MotionRegion";

const NAV = [
  { label: "Overview", to: "/dashboard", icon: "home" },
  { label: "Career paths", to: "/career-intelligence", icon: "spark" },
  { label: "Resume review", to: "/resume-intelligence", icon: "file" },
  { label: "Opportunities", to: "/jobs", icon: "briefcase" },
  { label: "Practice", to: "/interview", icon: "mic" },
  { label: "Learning plan", to: "/skills", icon: "layers" },
];

const ACTIONS = [
  { label: "Improve my resume", to: "/resume-intelligence", detail: "Resume" },
  {
    label: "Explore career matches",
    to: "/career-intelligence",
    detail: "Career AI",
  },
  { label: "Find and track jobs", to: "/jobs", detail: "Jobs" },
  { label: "Practice an interview", to: "/interview", detail: "Interview" },
  { label: "See my skill gaps", to: "/skills", detail: "Skills" },
  { label: "Update my profile", to: "/profile", detail: "Profile" },
];

export function Icon({ name, size = 18 }) {
  const paths = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v10H3z" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    spark: (
      <>
        <path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
      </>
    ),
    file: (
      <>
        <path d="M6 2h8l4 4v16H6z" />
        <path d="M14 2v5h4M9 12h6M9 16h6" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18M10 13v2h4v-2" />
      </>
    ),
    mic: (
      <>
        <rect x="9" y="2" width="6" height="13" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path
          d="m19.4 15 1.1 1.9-2 2-1.9-1.1a8 8 0 0 1-2 .8l-.5 2.2h-2.8l-.5-2.2a8 8 0 0 1-2-.8l-1.9 1.1-2-2L6 15a8 8 0 0 1-.8-2L3 12.5v-2.8l2.2-.5A8 8 0 0 1 6 7.2L4.9 5.3l2-2 1.9 1.1a8 8 0 0 1 2-.8L11.3 1h2.8l.5 2.2a8 8 0 0 1 2 .8l1.9-1.1 2 2-1.1 1.9a8 8 0 0 1 .8 2l2.2.5v2.8l-2.2.5a8 8 0 0 1-.8 2z"
          transform="translate(0 1) scale(.9)"
        />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 5 5" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M5 5 19 19M19 5 5 19" />,
    check: <path d="m4 12 5 5L20 6" />,
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6" />
      </>
    ),
    plus: <path d="M12 4v16M4 12h16" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function routeForIntent(value) {
  const query = value.trim().toLowerCase();
  if (!query) return null;
  if (/resume|cv|ats/.test(query)) return "/resume-intelligence";
  if (/interview|practice|question/.test(query)) return "/interview";
  if (/job|application|apply|hiring/.test(query)) return "/jobs";
  if (/skill|learn|roadmap|course|gap/.test(query)) return "/skills";
  if (/profile|education|goal|account/.test(query)) return "/profile";
  return "/career-intelligence";
}

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="ws-page-head">
      <div>
        <p className="ws-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="ws-muted">{description}</p>}
      </div>
      {action && <div className="ws-head-action">{action}</div>}
    </div>
  );
}

export function EmptyState({ icon = "spark", title, description, action }) {
  return (
    <div className="ws-empty">
      <span className="ws-empty-icon">
        <Icon name={icon} size={21} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action && <div className="ws-empty-action">{action}</div>}
    </div>
  );
}

export function DemoBanner() {
  return (
    <div className="ws-demo-banner">
      <span className="ws-demo-dot" />
      <span>
        <strong>Demo mode</strong> · This is a sample profile. Upload a real
        resume or edit the profile to use your own evidence.
      </span>
    </div>
  );
}

export function AskCareerUp({ compact = false }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const submit = (event) => {
    event.preventDefault();
    const to = routeForIntent(query);
    if (to) navigate(to);
  };
  return (
    <div className={`ws-ask ${compact ? "ws-ask-compact" : ""}`}>
      <form onSubmit={submit}>
        <Icon name="spark" size={18} />
        <label
          className="sr-only"
          htmlFor={compact ? "ws-ask-small" : "ws-ask-main"}
        >
          What do you want to achieve?
        </label>
        <input
          id={compact ? "ws-ask-small" : "ws-ask-main"}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What do you want to achieve?"
        />
        <button
          type="submit"
          aria-label="Go to suggested workspace"
          disabled={!query.trim()}
        >
          <Icon name="arrow" size={17} />
        </button>
      </form>
      {!compact && (
        <p>
          Try “Improve my resume”, “Practice an interview”, or “What skills am I
          missing?”
        </p>
      )}
    </div>
  );
}

export default function WorkspaceShell({ children, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [account, setAccount] = useState(user);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("careerup_sidebar_collapsed") === "true",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const page =
    [
      ...NAV,
      { label: "Profile", to: "/profile" },
      { label: "Settings", to: "/settings" },
    ].find((item) => item.to === location.pathname)?.label || "Workspace";
  const filtered = useMemo(
    () =>
      ACTIONS.filter((item) =>
        `${item.label} ${item.detail}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ).slice(0, 6),
    [search],
  );

  useEffect(() => {
    localStorage.setItem("careerup_sidebar_collapsed", String(collapsed));
  }, [collapsed]);
  useEffect(() => {
    const refreshAccount = () => setAccount(getStoredUser() || user);
    window.addEventListener("careerup:user-updated", refreshAccount);
    window.addEventListener("storage", refreshAccount);
    return () => {
      window.removeEventListener("careerup:user-updated", refreshAccount);
      window.removeEventListener("storage", refreshAccount);
    };
  }, [user]);
  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (paletteOpen) searchRef.current?.focus();
  }, [paletteOpen]);

  const logout = () => {
    clearStoredUser();
    navigate("/", { replace: true });
  };
  const openTo = (to) => {
    setPaletteOpen(false);
    setMobileOpen(false);
    setSearch("");
    navigate(to);
  };
  const navItem = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={() => setMobileOpen(false)}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) => `ws-nav-link ${isActive ? "active" : ""}`}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <div className={`ws-app ${collapsed ? "ws-collapsed" : ""}`}>
      <a href="#workspace-main" className="ws-skip-link">
        Skip to main content
      </a>
      {mobileOpen && (
        <button
          className="ws-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`ws-sidebar ${mobileOpen ? "ws-mobile-open" : ""}`}
        aria-label="Workspace navigation"
      >
        <div className="ws-brand-row">
          <Link to="/dashboard" className="ws-brand">
            <span className="ws-brand-mark">
              C<span>.</span>
            </span>
            <span className="ws-brand-text">
              CareerUp <strong>AI</strong>
              <small>Your career workspace</small>
            </span>
          </Link>
          <button
            className="ws-icon-button ws-collapse"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name="chevron" size={16} />
          </button>
          <button
            className="ws-icon-button ws-close-mobile"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="ws-nav-group">
          <p className="ws-nav-label">WORKSPACE</p>
          <nav>{NAV.map(navItem)}</nav>
        </div>
        <div className="ws-sidebar-bottom">
          <nav>
            {navItem({ label: "Profile", to: "/profile", icon: "user" })}
            {navItem({ label: "Settings", to: "/settings", icon: "settings" })}
          </nav>
          <div className="ws-account">
            <span className="ws-avatar">
              {(account?.name || "U")[0].toUpperCase()}
            </span>
            <span className="ws-account-name">
              <strong>{account?.name || "Your account"}</strong>
              <small>
                {account?.authMode === "demo"
                  ? "Sample workspace"
                  : "Device workspace"}
              </small>
            </span>
            <button onClick={logout} title="Sign out" aria-label="Sign out">
              <Icon name="logout" size={17} />
            </button>
          </div>
        </div>
      </aside>
      <div className="ws-main-wrap">
        <header className="ws-topbar">
          <div className="ws-topbar-left">
            <button
              className="ws-icon-button ws-menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Icon name="menu" />
            </button>
            <span className="ws-location">
              Workspace <Icon name="chevron" size={13} />{" "}
              <strong key={location.pathname}>{page}</strong>
            </span>
          </div>
          <div className="ws-topbar-right">
            <button
              className="ws-search-trigger"
              onClick={() => setPaletteOpen(true)}
              aria-label="Quick navigation"
              aria-expanded={paletteOpen}
            >
              <Icon name="search" size={16} />
              <span>Quick navigation</span>
              <kbd>Ctrl K</kbd>
            </button>
            <Link
              to="/profile"
              className="ws-top-avatar"
              aria-label="Open profile"
            >
              {(account?.name || "U")[0].toUpperCase()}
            </Link>
          </div>
        </header>
        <main className="ws-content" id="workspace-main">
          <MotionRegion key={location.pathname} className="ws-page-motion">
            {children}
          </MotionRegion>
        </main>
      </div>
      {paletteOpen && (
        <div
          className="ws-palette-backdrop"
          onMouseDown={() => setPaletteOpen(false)}
        >
          <div
            className="ws-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Quick actions"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ws-palette-search">
              <Icon name="search" />
              <input
                ref={searchRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    const to = filtered[0]?.to || routeForIntent(search);
                    if (to) openTo(to);
                  }
                }}
                placeholder="Search your workspace"
              />
              <button
                onClick={() => setPaletteOpen(false)}
                aria-label="Close quick actions"
              >
                <Icon name="close" size={17} />
              </button>
            </div>
            <div className="ws-palette-results">
              <p>QUICK ACTIONS</p>
              {filtered.length ? (
                filtered.map((item) => (
                  <button key={item.to} onClick={() => openTo(item.to)}>
                    <span>{item.label}</span>
                    <small>{item.detail}</small>
                  </button>
                ))
              ) : (
                <button
                  onClick={() => {
                    const to = routeForIntent(search);
                    if (to) openTo(to);
                  }}
                >
                  <span>Explore career paths</span>
                  <small>Go to workspace</small>
                </button>
              )}
            </div>
            <footer>Enter to open · Esc to close</footer>
          </div>
        </div>
      )}
    </div>
  );
}
