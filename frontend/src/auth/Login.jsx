import { useState } from "react";

const INK = "#0B1220";
const INK_SOFT = "#141D30";
const PAPER = "#FAF9F6";
const GOLD = "#C9A24B";
const GOLD_SOFT = "#E7C87A";
const MINT = "#7FD9B0";
const TEXT_MUTED = "#8A93A6";

/* -----------------------------
   Small SVG Icons
----------------------------- */

function MailIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EyeOffIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 6.2A10.4 10.4 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.8" />
      <path d="M6.7 6.7C3.9 8.6 2.5 12 2.5 12s3.5 6 9.5 6c1.2 0 2.3-.2 3.3-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ShieldIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function LoaderIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

/* -----------------------------
   Career trajectory graphic
----------------------------- */

function TrajectoryMark({ compact = false }) {
  const w = compact ? 340 : 460;
  const h = compact ? 130 : 240;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={`pathGrad-${compact ? "compact" : "full"}`}
          x1="0"
          y1="1"
          x2="1"
          y2="0"
        >
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
          <stop offset="100%" stopColor={GOLD_SOFT} stopOpacity="1" />
        </linearGradient>
      </defs>

      {!compact &&
        [0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="0"
            x2={w}
            y1={40 + i * 44}
            y2={40 + i * 44}
            stroke="#ffffff"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        ))}

      <path
        d={
          compact
            ? "M 8 100 C 60 100, 70 70, 120 62 C 170 54, 180 30, 240 22 C 280 16, 300 10, 332 6"
            : "M 10 205 C 90 205, 100 150, 160 140 C 220 130, 230 90, 300 78 C 355 68, 370 40, 445 30"
        }
        fill="none"
        stroke={`url(#pathGrad-${compact ? "compact" : "full"})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation:
            "drawPath 1.6s cubic-bezier(0.65,0,0.35,1) 0.15s forwards",
        }}
      />

      {!compact &&
        [
          { x: 10, y: 205, label: "Associate" },
          { x: 160, y: 140, label: "Senior" },
          { x: 300, y: 78, label: "Lead" },
        ].map((point, i) => (
          <g
            key={point.label}
            style={{
              opacity: 0,
              animation: `fadeIn 0.5s ease-out ${
                0.8 + i * 0.3
              }s forwards`,
            }}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={PAPER}
              stroke={GOLD}
              strokeWidth="2"
            />

            <text
              x={point.x}
              y={point.y - 14}
              fontFamily="'JetBrains Mono', monospace"
              fontSize="10"
              fill={TEXT_MUTED}
              textAnchor={i === 0 ? "start" : "middle"}
            >
              {point.label}
            </text>
          </g>
        ))}

      <g
        style={{
          opacity: 0,
          animation: `fadeIn 0.5s ease-out ${
            compact ? 1.1 : 1.7
          }s forwards`,
        }}
      >
        <circle
          cx={compact ? 332 : 445}
          cy={compact ? 6 : 30}
          r="10"
          fill={GOLD}
          fillOpacity="0.18"
        >
          <animate
            attributeName="r"
            values="8;14;8"
            dur="2.2s"
            repeatCount="indefinite"
          />

          <animate
            attributeName="fill-opacity"
            values="0.25;0.05;0.25"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          cx={compact ? 332 : 445}
          cy={compact ? 6 : 30}
          r="4.5"
          fill={GOLD_SOFT}
        />

        {!compact && (
          <text
            x="445"
            y="12"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="10"
            fill={GOLD_SOFT}
            textAnchor="end"
          >
            Principal — next
          </text>
        )}
      </g>
    </svg>
  );
}

/* -----------------------------
   Login Page
----------------------------- */

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  const handleLogin = async (e) => {
    e.preventDefault();

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Login successful!");

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      } else {
        setStatus("error");
        setMessage(
          data.message || "Invalid email or password."
        );
      }
    } catch (error) {
      console.error(error);

      setStatus("error");
      setMessage(
        "Unable to connect to server. Please try again."
      );
    }
  };

  return (
    <div
      className="flex min-h-screen w-full"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes blobFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(20px, -24px) scale(1.08);
          }
        }

        @keyframes shimmerSweep {
          0% {
            transform: translateX(-120%) skewX(-15deg);
          }

          100% {
            transform: translateX(220%) skewX(-15deg);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes checkPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }

          60% {
            transform: scale(1.2);
            opacity: 1;
          }

          100% {
            transform: scale(1);
          }
        }

        .cu-rise {
          opacity: 0;
          animation:
            riseIn 0.55s cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .cu-input-wrap {
          position: relative;
        }

        .cu-input {
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .cu-input:focus {
          border-color: ${GOLD} !important;
          box-shadow: 0 0 0 4px rgba(201,162,75,0.14);
          background: #fff !important;
        }

        .cu-underline {
          position: absolute;
          left: 0;
          bottom: -1px;
          height: 2px;
          width: 0%;
          background: linear-gradient(
            90deg,
            ${GOLD},
            ${GOLD_SOFT}
          );
          transition: width 0.3s ease;
        }

        .cu-input:focus ~ .cu-underline {
          width: 100%;
        }

        .cu-cta {
          position: relative;
          overflow: hidden;
          transition:
            transform 0.2s ease,
            box-shadow 0.25s ease;
        }

        .cu-cta:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 14px 30px rgba(201,162,75,0.4);
        }

        .cu-cta:active:not(:disabled) {
          transform: translateY(0);
        }

        .cu-cta::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 40%;
          background:
            linear-gradient(
              120deg,
              transparent,
              rgba(255,255,255,0.55),
              transparent
            );
          animation:
            shimmerSweep 2.6s ease-in-out infinite;
        }

        .cu-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(60px);
          animation:
            blobFloat 10s ease-in-out infinite;
        }

        .cu-toggle {
          width: 34px;
          height: 20px;
          border-radius: 9999px;
          position: relative;
          transition: background 0.25s ease;
          cursor: pointer;
        }

        .cu-toggle-dot {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #fff;
          transition:
            transform 0.25s
            cubic-bezier(0.34,1.56,0.64,1);
        }

        .cu-logo:hover {
          transform: rotate(-6deg) scale(1.06);
        }
      `}</style>

      {/* =====================================
          LEFT BRAND PANEL
      ====================================== */}

      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden px-14 py-12 lg:flex"
        style={{
          background: `linear-gradient(
            160deg,
            ${INK} 0%,
            ${INK_SOFT} 100%
          )`,
        }}
      >
        <div
          className="cu-blob"
          style={{
            width: 260,
            height: 260,
            background: GOLD,
            opacity: 0.12,
            top: -60,
            right: -60,
          }}
        />

        <div
          className="cu-blob"
          style={{
            width: 220,
            height: 220,
            background: MINT,
            opacity: 0.08,
            bottom: 40,
            left: -60,
            animationDelay: "2s",
          }}
        />

        {/* Logo */}
        <div
          className="cu-rise relative z-10 flex items-center gap-2.5"
          style={{ animationDelay: "0.05s" }}
        >
          <div
            className="cu-logo flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-transform duration-300"
            style={{
              background: GOLD,
              color: INK,
            }}
          >
            c
          </div>

          <span
            className="text-lg font-semibold tracking-tight text-white"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            CareerUp AI
          </span>
        </div>

        {/* Main branding */}
        <div className="relative z-10">
          <p
            className="cu-rise text-[13px] font-medium uppercase tracking-[0.2em]"
            style={{
              color: GOLD_SOFT,
              fontFamily: "'JetBrains Mono', monospace",
              animationDelay: "0.15s",
            }}
          >
            Your career path
          </p>

          <h1
            className="cu-rise mt-4 max-w-md text-4xl font-semibold leading-[1.15] text-white xl:text-5xl"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              animationDelay: "0.25s",
            }}
          >
            Your next chapter
            <br />
            starts here.
          </h1>

          <p
            className="cu-rise mt-4 max-w-sm text-[15px] leading-relaxed"
            style={{
              color: TEXT_MUTED,
              animationDelay: "0.35s",
            }}
          >
            Understand your skills, discover opportunities,
            and build a smarter path toward the career you
            actually want.
          </p>

          {/* Career trajectory */}
          <div
            className="cu-rise mt-10"
            style={{ animationDelay: "0.5s" }}
          >
            <TrajectoryMark />
          </div>
        </div>

        {/* Security */}
        <div
          className="cu-rise relative z-10 flex items-center gap-2 text-xs"
          style={{
            color: TEXT_MUTED,
            animationDelay: "0.6s",
          }}
        >
          <ShieldIcon
            className="h-4 w-4"
            style={{ color: MINT }}
          />

          <span>
            Your career data stays protected
          </span>
        </div>
      </div>

      {/* =====================================
          RIGHT LOGIN PANEL
      ====================================== */}

      <div
        className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-16 lg:w-1/2"
        style={{
          background: PAPER,
        }}
      >
        <div
          className="cu-blob"
          style={{
            width: 300,
            height: 300,
            background: GOLD,
            opacity: 0.1,
            top: -100,
            right: -100,
          }}
        />

        <div
          className="cu-blob"
          style={{
            width: 240,
            height: 240,
            background: MINT,
            opacity: 0.08,
            bottom: -80,
            left: -60,
            animationDelay: "3s",
          }}
        />

        <div className="relative z-10 w-full max-w-sm">

          {/* Mobile logo */}
          <div
            className="cu-rise mb-6 flex items-center gap-2.5 lg:hidden"
            style={{ animationDelay: "0.05s" }}
          >
            <div
              className="cu-logo flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-transform duration-300"
              style={{
                background: GOLD,
                color: INK,
              }}
            >
              A
            </div>

            <span
              className="text-lg font-semibold tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: INK,
              }}
            >
              CareerUp AI
            </span>
          </div>

          {/* Mobile signature */}
          <div
            className="cu-rise mb-6 rounded-2xl p-4 lg:hidden"
            style={{
              background: `linear-gradient(
                135deg,
                ${INK} 0%,
                ${INK_SOFT} 100%
              )`,
              animationDelay: "0.12s",
            }}
          >
            <p
              className="text-[11px] font-medium uppercase tracking-[0.18em]"
              style={{
                color: GOLD_SOFT,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Your career path
            </p>

            <TrajectoryMark compact />

            <p
              className="mt-1 text-[12px]"
              style={{ color: TEXT_MUTED }}
            >
              Build the skills. Find the opportunity.
              <span
                style={{
                  color: GOLD_SOFT,
                  fontWeight: 600,
                }}
              >
                {" "}
                Shape your future.
              </span>
            </p>
          </div>

          {/* Heading */}
          <div
            className="cu-rise"
            style={{ animationDelay: "0.2s" }}
          >
            <h2
              className="text-[28px] font-semibold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: INK,
              }}
            >
              Welcome back
            </h2>

            <p
              className="mt-2 text-[15px]"
              style={{ color: TEXT_MUTED }}
            >
              Sign in to continue your career journey.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-4"
          >

            {/* Email */}
            <div
              className="cu-rise"
              style={{ animationDelay: "0.3s" }}
            >
              <label
                className="mb-1.5 block text-[13px] font-semibold"
                style={{ color: INK }}
              >
                Email address
              </label>

              <div className="cu-input-wrap">
                <MailIcon
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: TEXT_MUTED }}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  className="cu-input w-full rounded-xl border py-3 pl-10 pr-4 text-[15px] outline-none"
                  style={{
                    borderColor: "#E3E1DA",
                    background: "#fff",
                    color: INK,
                  }}
                />

                <span className="cu-underline" />
              </div>
            </div>

            {/* Password */}
            <div
              className="cu-rise"
              style={{ animationDelay: "0.38s" }}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  className="text-[13px] font-semibold"
                  style={{ color: INK }}
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-[13px] font-medium hover:underline"
                  style={{ color: GOLD }}
                  onClick={() =>
                    setMessage(
                      "Password reset isn't wired up yet."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="cu-input-wrap">
                <LockIcon
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: TEXT_MUTED }}
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="cu-input w-full rounded-xl border py-3 pl-10 pr-11 text-[15px] outline-none"
                  style={{
                    borderColor: "#E3E1DA",
                    background: "#fff",
                    color: INK,
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((s) => !s)
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-transform duration-150 active:scale-90"
                  style={{ color: TEXT_MUTED }}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>

                <span className="cu-underline" />
              </div>
            </div>

            {/* Remember me */}
            <div
              className="cu-rise flex items-center justify-between pt-1"
              style={{ animationDelay: "0.44s" }}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={remember}
                  onClick={() =>
                    setRemember((r) => !r)
                  }
                  className="cu-toggle"
                  style={{
                    background: remember
                      ? GOLD
                      : "#DDD8CC",
                  }}
                >
                  <div
                    className="cu-toggle-dot"
                    style={{
                      transform: remember
                        ? "translateX(14px)"
                        : "translateX(0)",
                    }}
                  />
                </button>

                <span
                  className="text-[13px]"
                  style={{ color: TEXT_MUTED }}
                >
                  Remember me
                </span>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="cu-cta cu-rise flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-80"
              style={{
                background: `linear-gradient(
                  135deg,
                  ${GOLD} 0%,
                  ${GOLD_SOFT} 100%
                )`,
                color: INK,
                animationDelay: "0.52s",
              }}
            >
              {status === "loading" ? (
                <>
                  <LoaderIcon
                    className="h-4 w-4"
                    style={{
                      animation:
                        "spin 0.8s linear infinite",
                    }}
                  />

                  Signing in...
                </>
              ) : status === "success" ? (
                <>
                  <CheckIcon
                    className="h-4 w-4"
                    style={{
                      animation:
                        "checkPop 0.4s ease-out",
                    }}
                  />

                  Success
                </>
              ) : (
                <>
                  Sign in

                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Status message */}
          {message && (
            <p
              className="mt-4 rounded-lg px-3 py-2 text-center text-[13px] font-medium"
              style={{
                opacity: 0,
                animation:
                  "popIn 0.3s ease-out forwards",
                color:
                  status === "success"
                    ? "#166534"
                    : "#8B1E1E",
                background:
                  status === "success"
                    ? "#F0FDF4"
                    : "#FEF2F2",
              }}
            >
              {message}
            </p>
          )}

          {/* Register */}
          <p
            className="cu-rise mt-8 text-center text-[13px]"
            style={{
              color: TEXT_MUTED,
              animationDelay: "0.6s",
            }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() =>
                (window.location.href = "/register")
              }
              className="font-semibold hover:underline"
              style={{ color: INK }}
            >
              Create one
            </button>
          </p>

          {/* Footer */}
          <p
            className="mt-8 text-center text-[10px] uppercase tracking-[0.15em]"
            style={{ color: "#B7B2A7" }}
          >
            CareerUp AI · Career Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}