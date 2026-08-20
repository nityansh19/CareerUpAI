import { useEffect, useState } from "react";

const GOLD = "#D7B45A";
const GOLD_LIGHT = "#F5DF9A";
const PURPLE = "#7C5CFF";

function Icon({ type, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = {
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.8-3.4 3.2-5 7-5s6.2 1.6 7 5" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    spark: (
      <>
        <path d="m12 2-1.8 7.2L3 11l7.2 1.8L12 20l1.8-7.2L21 11l-7.2-1.8L12 2Z" />
        <path d="m19 17-.7 2.3L16 20l2.3.7L19 23l.7-2.3L22 20l-2.3-.7L19 17Z" />
      </>
    ),

    brain: (
      <>
        <path d="M9.5 4.5A3.5 3.5 0 0 0 6 8c0 .4.1.8.2 1.2A3.5 3.5 0 0 0 7 16a3.5 3.5 0 0 0 3.5 3.5" />
        <path d="M14.5 4.5A3.5 3.5 0 0 1 18 8c0 .4-.1.8-.2 1.2A3.5 3.5 0 0 1 17 16a3.5 3.5 0 0 1-3.5 3.5" />
        <path d="M12 4v16" />
        <path d="M7 11h5" />
        <path d="M12 14h5" />
      </>
    ),

    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 3-4 3 2 5-7" />
      </>
    ),

    check: <path d="m5 12 4 4L19 6" />,

    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),

    eyeOff: (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.7" />
        <path d="M6.2 6.2C3.8 8 2.5 12 2.5 12S6 18 12 18c1.2 0 2.3-.2 3.3-.6" />
      </>
    ),
  };

  return <svg {...common}>{paths[type]}</svg>;
}

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setStatus("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(
          "Your CareerUp AI profile has been created."
        );

        setFormData({
          name: "",
          email: "",
          password: "",
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 1400);
      } else {
        setStatus("error");
        setMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error(error);

      setStatus("error");
      setMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cu-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #050711;
        }

        .cu-page {
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at 15% 15%,
              rgba(124,92,255,.13),
              transparent 28%
            ),
            radial-gradient(
              circle at 85% 20%,
              rgba(215,180,90,.09),
              transparent 25%
            ),
            #050711;
          color: white;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        /* GRID */

        .cu-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .34;
          background-image:
            linear-gradient(
              rgba(255,255,255,.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.035) 1px,
              transparent 1px
            );
          background-size: 60px 60px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 90%
          );
        }

        /* ORBS */

        .cu-orb {
          position: fixed;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(100px);
        }

        .orb-one {
          width: 420px;
          height: 420px;
          left: -170px;
          top: 120px;
          background: rgba(101,72,255,.16);
          animation: orbOne 11s ease-in-out infinite;
        }

        .orb-two {
          width: 360px;
          height: 360px;
          right: -130px;
          bottom: 50px;
          background: rgba(215,180,90,.10);
          animation: orbTwo 13s ease-in-out infinite;
        }

        .orb-three {
          width: 230px;
          height: 230px;
          right: 30%;
          top: 15%;
          background: rgba(124,92,255,.08);
          animation: orbThree 8s ease-in-out infinite;
        }

        @keyframes orbOne {
          0%,100% {
            transform: translate(0,0);
          }
          50% {
            transform: translate(90px,-50px);
          }
        }

        @keyframes orbTwo {
          0%,100% {
            transform: translate(0,0);
          }
          50% {
            transform: translate(-80px,30px);
          }
        }

        @keyframes orbThree {
          0%,100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.35);
          }
        }

        /* PARTICLES */

        .cu-particle {
          position: fixed;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,.45);
          pointer-events: none;
          animation: particleFloat linear infinite;
        }

        @keyframes particleFloat {
          from {
            transform: translateY(100vh);
            opacity: 0;
          }

          15% {
            opacity: .7;
          }

          80% {
            opacity: .25;
          }

          to {
            transform: translateY(-20vh);
            opacity: 0;
          }
        }

        /* NAV */

        .cu-nav {
          position: relative;
          z-index: 20;
          height: 74px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          background: rgba(5,7,17,.65);
          backdrop-filter: blur(24px);
        }

        /* LOGO */

        .cu-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          border: 0;
          background: transparent;
          color: white;
        }

        .cu-logo-mark {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: linear-gradient(
            135deg,
            #f0d98a,
            #c49c3f
          );
          color: #070910;
          font-weight: 900;
          box-shadow:
            0 8px 30px rgba(215,180,90,.17);
        }

        /* MAIN */

        .cu-main {
          position: relative;
          z-index: 5;
          max-width: 1400px;
          margin: auto;
          padding: 70px 45px 100px;
        }

        .cu-layout {
          display: grid;
          grid-template-columns: 1fr 530px;
          gap: 80px;
          align-items: center;
        }

        /* LEFT */

        .cu-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 999px;
          background: rgba(255,255,255,.035);
          color: rgba(255,255,255,.52);
          font-size: 10px;
          letter-spacing: .18em;
          text-transform: uppercase;
          animation: fadeUp .7s ease both;
        }

        .cu-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #65d391;
          box-shadow: 0 0 14px #65d391;
          animation: livePulse 2s infinite;
        }

        @keyframes livePulse {
          0%,100% {
            transform: scale(1);
            opacity: .7;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        .cu-title {
          margin-top: 28px;
          max-width: 700px;
          font-size: clamp(50px, 6vw, 82px);
          line-height: .95;
          letter-spacing: -.065em;
          font-weight: 700;
          animation: fadeUp .8s .1s ease both;
        }

        .cu-gradient {
          background:
            linear-gradient(
              100deg,
              #fff 0%,
              #f2d989 42%,
              #a48aff 100%
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .cu-description {
          max-width: 610px;
          margin-top: 27px;
          color: rgba(255,255,255,.39);
          font-size: 16px;
          line-height: 1.8;
          animation: fadeUp .8s .2s ease both;
        }

        /* AI PREVIEW */

        .cu-preview {
          position: relative;
          margin-top: 45px;
          width: min(100%, 660px);
          padding: 24px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 27px;
          background: rgba(255,255,255,.025);
          backdrop-filter: blur(20px);
          box-shadow: 0 30px 100px rgba(0,0,0,.28);
          transform:
            translate(
              calc(var(--mx) * .2px),
              calc(var(--my) * .2px)
            );
          transition: transform .15s ease;
          animation: fadeUp .8s .3s ease both;
        }

        .preview-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .preview-label {
          font-size: 10px;
          color: rgba(255,255,255,.3);
          text-transform: uppercase;
          letter-spacing: .18em;
        }

        .ai-status {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #82d7a0;
          font-size: 10px;
        }

        .preview-content {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 25px;
        }

        .score {
          display: grid;
          place-items: center;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              #101421 57%,
              transparent 58%
            ),
            conic-gradient(
              #d7b45a 0 84%,
              rgba(255,255,255,.06) 84% 100%
            );
          box-shadow:
            0 0 50px rgba(215,180,90,.08);
        }

        .score strong {
          font-size: 31px;
        }

        .score span {
          display: block;
          margin-top: -30px;
          color: rgba(255,255,255,.3);
          font-size: 9px;
        }

        .skill-bars {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 13px;
        }

        .skill-row {
          display: grid;
          grid-template-columns: 75px 1fr 30px;
          gap: 10px;
          align-items: center;
          font-size: 9px;
          color: rgba(255,255,255,.38);
        }

        .bar {
          height: 5px;
          overflow: hidden;
          border-radius: 99px;
          background: rgba(255,255,255,.06);
        }

        .bar div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #7560ff,
            #d7b45a
          );
          animation: barGrow 1.5s ease both;
        }

        @keyframes barGrow {
          from {
            width: 0;
          }
        }

        /* FORM */

        .cu-card-wrap {
          position: relative;
          animation: fadeUp .9s .15s ease both;
        }

        .cu-card-glow {
          position: absolute;
          inset: 30px;
          border-radius: 50px;
          background: rgba(108,80,255,.14);
          filter: blur(65px);
        }

        .cu-card {
          position: relative;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 34px;
          padding: 34px;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.075),
              rgba(255,255,255,.025)
            );
          backdrop-filter: blur(35px);
          box-shadow:
            0 35px 100px rgba(0,0,0,.42),
            inset 0 1px 0 rgba(255,255,255,.07);
        }

        .card-shine {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          border-radius: inherit;
        }

        .card-shine::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 100%;
          top: 0;
          left: -220px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.055),
            transparent
          );
          transform: skewX(-18deg);
          animation: shine 6s infinite;
        }

        @keyframes shine {
          0% {
            left: -220px;
          }
          35%,100% {
            left: 700px;
          }
        }

        .card-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          color: #f0d98a;
          background: rgba(215,180,90,.08);
          border: 1px solid rgba(215,180,90,.12);
          box-shadow: 0 10px 35px rgba(215,180,90,.06);
        }

        .form-title {
          margin-top: 23px;
          font-size: 31px;
          font-weight: 650;
          letter-spacing: -.04em;
        }

        .form-subtitle {
          margin-top: 8px;
          color: rgba(255,255,255,.34);
          font-size: 13px;
          line-height: 1.7;
        }

        .field {
          margin-top: 20px;
        }

        .field label {
          display: block;
          margin-bottom: 8px;
          color: rgba(255,255,255,.55);
          font-size: 11px;
          font-weight: 600;
        }

        .input-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,.25);
        }

        .cu-input {
          width: 100%;
          height: 55px;
          border-radius: 17px;
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(255,255,255,.035);
          padding: 0 48px;
          color: white;
          font-size: 13px;
          transition: .25s ease;
        }

        .cu-input::placeholder {
          color: rgba(255,255,255,.19);
        }

        .cu-input:focus {
          outline: none;
          border-color: rgba(215,180,90,.5);
          background: rgba(255,255,255,.06);
          box-shadow:
            0 0 0 4px rgba(215,180,90,.055),
            0 15px 40px rgba(0,0,0,.12);
        }

        .password-button {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: rgba(255,255,255,.25);
          cursor: pointer;
          transition: .2s;
        }

        .password-button:hover {
          color: white;
        }

        .terms {
          display: flex;
          gap: 10px;
          margin-top: 18px;
          color: rgba(255,255,255,.28);
          font-size: 10px;
          line-height: 1.6;
        }

        .terms input {
          accent-color: #d7b45a;
          margin-top: 2px;
        }

        .cu-button {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 57px;
          margin-top: 22px;
          border: 0;
          border-radius: 17px;
          cursor: pointer;
          color: #090a0e;
          background:
            linear-gradient(
              100deg,
              #d7b45a,
              #f0d98a,
              #c59e47
            );
          font-size: 13px;
          font-weight: 750;
          box-shadow:
            0 18px 45px rgba(215,180,90,.14);
          transition: .25s ease;
        }

        .cu-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 23px 55px rgba(215,180,90,.22);
        }

        .cu-button:active {
          transform: translateY(0);
        }

        .button-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .button-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            100deg,
            transparent,
            rgba(255,255,255,.35),
            transparent
          );
          transform: translateX(-120%);
          animation: buttonShine 3.5s infinite;
        }

        @keyframes buttonShine {
          0%,40% {
            transform: translateX(-120%);
          }
          75%,100% {
            transform: translateX(120%);
          }
        }

        .status {
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 13px;
          text-align: center;
          font-size: 11px;
        }

        .success {
          color: #86efac;
          background: rgba(74,222,128,.06);
          border: 1px solid rgba(74,222,128,.12);
        }

        .error {
          color: #fca5a5;
          background: rgba(248,113,113,.06);
          border: 1px solid rgba(248,113,113,.12);
        }

        /* STATS */

        .cu-stats {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 10px;
          margin-top: 24px;
        }

        .cu-stat {
          padding: 15px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 15px;
          background: rgba(255,255,255,.025);
        }

        .cu-stat strong {
          display: block;
          color: white;
          font-size: 16px;
        }

        .cu-stat span {
          display: block;
          margin-top: 3px;
          color: rgba(255,255,255,.25);
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        /* FEATURES */

        .cu-features {
          position: relative;
          z-index: 5;
          border-top: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.018);
        }

        .feature-inner {
          max-width: 1400px;
          margin: auto;
          padding: 80px 45px;
        }

        .feature-heading {
          max-width: 650px;
        }

        .feature-heading small {
          color: #d7b45a;
          font-size: 9px;
          letter-spacing: .25em;
          text-transform: uppercase;
        }

        .feature-heading h2 {
          margin-top: 14px;
          font-size: 40px;
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        .feature-heading p {
          margin-top: 15px;
          color: rgba(255,255,255,.3);
          font-size: 13px;
          line-height: 1.7;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 14px;
          margin-top: 40px;
        }

        .feature {
          padding: 25px;
          min-height: 190px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 23px;
          background: rgba(255,255,255,.025);
          transition: .35s ease;
        }

        .feature:hover {
          transform: translateY(-7px);
          border-color: rgba(215,180,90,.2);
          background: rgba(255,255,255,.045);
          box-shadow: 0 20px 60px rgba(0,0,0,.18);
        }

        .feature-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 13px;
          color: #f0d98a;
          background: rgba(215,180,90,.08);
        }

        .feature h3 {
          margin-top: 23px;
          font-size: 14px;
        }

        .feature p {
          margin-top: 8px;
          color: rgba(255,255,255,.27);
          font-size: 11px;
          line-height: 1.7;
        }

        /* ANIMATIONS */

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* RESPONSIVE */

        @media(max-width:1000px) {

          .cu-main {
            padding: 50px 25px 80px;
          }

          .cu-layout {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .cu-title {
            font-size: 58px;
          }

          .cu-card-wrap {
            max-width: 600px;
          }

          .feature-grid {
            grid-template-columns: repeat(2,1fr);
          }
        }

        @media(max-width:600px) {

          .cu-main {
            padding: 35px 17px 60px;
          }

          .cu-nav {
            height: 65px;
          }

          .cu-title {
            font-size: 46px;
          }

          .cu-description {
            font-size: 14px;
          }

          .cu-preview {
            padding: 17px;
          }

          .preview-content {
            grid-template-columns: 1fr;
          }

          .score {
            margin: auto;
          }

          .cu-card {
            padding: 23px;
            border-radius: 26px;
          }

          .feature-inner {
            padding: 60px 17px;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .cu-stats {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

      {/* BACKGROUND */}

      <div className="cu-grid" />

      <div className="cu-orb orb-one" />
      <div className="cu-orb orb-two" />
      <div className="cu-orb orb-three" />

      {/* PARTICLES */}

      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className="cu-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}

      {/* NAVBAR */}

      <nav className="cu-nav">

        <div
          style={{
            maxWidth: 1400,
            height: "100%",
            margin: "auto",
            padding: "0 45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

          <button
            className="cu-logo"
            onClick={() => {
              window.location.href = "/";
            }}
          >

            <div className="cu-logo-mark">
              C
            </div>

            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "-.02em",
                }}
              >
                CareerUp AI
              </div>

              <div
                style={{
                  fontSize: 7,
                  letterSpacing: ".28em",
                  color: "rgba(255,255,255,.25)",
                  marginTop: 2,
                }}
              >
                CAREER INTELLIGENCE
              </div>
            </div>

          </button>

          <div
            style={{
              color: "rgba(255,255,255,.35)",
              fontSize: 11,
            }}
          >
            Already a member?

            <button
              onClick={() => {
                window.location.href = "/login";
              }}
              style={{
                border: 0,
                background: "transparent",
                color: GOLD_LIGHT,
                fontWeight: 600,
                cursor: "pointer",
                marginLeft: 7,
              }}
            >
              Sign in →
            </button>
          </div>

        </div>

      </nav>

      {/* MAIN */}

      <main className="cu-main">

        <div className="cu-layout">

          {/* LEFT */}

          <section>

            <div className="cu-eyebrow">

              <span className="cu-live-dot" />

              AI-powered career intelligence

            </div>

            <h1 className="cu-title">

              Your career
              <br />

              deserves a
              <br />

              <span className="cu-gradient">
                smarter path.
              </span>

            </h1>

            <p className="cu-description">
              CareerUp AI transforms your education, skills,
              experience and ambitions into a personalized
              career intelligence profile. Understand your
              strengths, discover opportunities, identify
              skill gaps and build the path toward the career
              you actually want.
            </p>

            {/* AI PREVIEW */}

            <div
              className="cu-preview"
              style={{
                "--mx": mouse.x,
                "--my": mouse.y,
              }}
            >

              <div className="preview-top">

                <div>

                  <div className="preview-label">
                    Career Intelligence Engine
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Your career profile
                  </div>

                </div>

                <div className="ai-status">

                  <span className="cu-live-dot" />

                  AI READY

                </div>

              </div>

              <div className="preview-content">

                <div>

                  <div className="score">

                    <div style={{ textAlign: "center" }}>
                      <strong>84</strong>

                      <span>
                        / 100 readiness
                      </span>
                    </div>

                  </div>

                </div>

                <div className="skill-bars">

                  {[
                    ["Technical Skills", 91],
                    ["Experience", 76],
                    ["Career Fit", 88],
                    ["Profile Strength", 82],
                  ].map(([name, value]) => (

                    <div
                      className="skill-row"
                      key={name}
                    >

                      <span>{name}</span>

                      <div className="bar">
                        <div
                          style={{
                            width: `${value}%`,
                          }}
                        />
                      </div>

                      <span>{value}%</span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </section>

          {/* REGISTER */}

          <section className="cu-card-wrap">

            <div className="cu-card-glow" />

            <div className="cu-card">

              <div className="card-shine" />

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                }}
              >

                <div className="card-icon">
                  <Icon type="spark" />
                </div>

                <div className="form-title">
                  Start your journey.
                </div>

                <p className="form-subtitle">
                  Create your CareerUp AI profile and let
                  intelligence guide your next career move.
                </p>

                <form onSubmit={handleSubmit}>

                  {/* NAME */}

                  <div className="field">

                    <label>
                      FULL NAME
                    </label>

                    <div className="input-wrap">

                      <div className="input-icon">
                        <Icon type="user" />
                      </div>

                      <input
                        className="cu-input"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                      />

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="field">

                    <label>
                      EMAIL ADDRESS
                    </label>

                    <div className="input-wrap">

                      <div className="input-icon">
                        <Icon type="mail" />
                      </div>

                      <input
                        className="cu-input"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}

                  <div className="field">

                    <label>
                      PASSWORD
                    </label>

                    <div className="input-wrap">

                      <div className="input-icon">
                        <Icon type="lock" />
                      </div>

                      <input
                        className="cu-input"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        className="password-button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >
                        <Icon
                          type={
                            showPassword
                              ? "eyeOff"
                              : "eye"
                          }
                        />
                      </button>

                    </div>

                  </div>

                  {/* TERMS */}

                  <label className="terms">

                    <input
                      type="checkbox"
                      required
                    />

                    <span>
                      I agree to the CareerUp AI terms and
                      understand that my profile information
                      will be used to personalize my career
                      intelligence experience.
                    </span>

                  </label>

                  {/* CTA */}

                  <button
                    className="cu-button"
                    disabled={loading}
                    type="submit"
                  >

                    <span className="button-glow" />

                    <span className="button-content">

                      {loading
                        ? "Building your profile..."
                        : "Create my CareerUp AI profile"}

                      {!loading && (
                        <Icon
                          type="arrow"
                          size={17}
                        />
                      )}

                    </span>

                  </button>

                </form>

                {/* STATUS */}

                {message && (

                  <div
                    className={`status ${
                      status === "success"
                        ? "success"
                        : "error"
                    }`}
                  >
                    {message}
                  </div>

                )}

                {/* STATS */}

                <div className="cu-stats">

                  <div className="cu-stat">

                    <strong>AI</strong>

                    <span>
                      Career Analysis
                    </span>

                  </div>

                  <div className="cu-stat">

                    <strong>CV</strong>

                    <span>
                      Smart Analysis
                    </span>

                  </div>

                  <div className="cu-stat">

                    <strong>∞</strong>

                    <span>
                      Growth Potential
                    </span>

                  </div>

                </div>

                <div
                  style={{
                    marginTop: 23,
                    textAlign: "center",
                    color: "rgba(255,255,255,.27)",
                    fontSize: 10,
                  }}
                >
                  Already have an account?

                  <button
                    onClick={() => {
                      window.location.href =
                        "/login";
                    }}
                    style={{
                      marginLeft: 5,
                      border: 0,
                      background: "transparent",
                      color: GOLD_LIGHT,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Sign in
                  </button>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

      {/* FEATURES */}

      <section className="cu-features">

        <div className="feature-inner">

          <div className="feature-heading">

            <small>
              What happens after you join
            </small>

            <h2>
              One profile.
              <br />
              A complete career intelligence system.
            </h2>

            <p>
              CareerUp AI is designed to move beyond a
              traditional resume platform. Your profile
              becomes the foundation for understanding,
              improving and advancing your career.
            </p>

          </div>

          <div className="feature-grid">

            {[
              {
                icon: "brain",
                title: "AI CV Analysis",
                text:
                  "Upload your existing CV and let AI analyze your education, experience, projects, skills and career direction.",
              },

              {
                icon: "chart",
                title: "Skill Gap Intelligence",
                text:
                  "Understand which skills can strengthen your profile and what you should focus on next.",
              },

              {
                icon: "spark",
                title: "AI CV Builder",
                text:
                  "Don't have a CV? Provide your information and build a professional, structured career document.",
              },

              {
                icon: "arrow",
                title: "Career Roadmap",
                text:
                  "Turn your current profile into a practical roadmap designed around your target career.",
              },
            ].map((item) => (

              <div
                className="feature"
                key={item.title}
              >

                <div className="feature-icon">

                  <Icon
                    type={item.icon}
                    size={17}
                  />

                </div>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer
        style={{
          position: "relative",
          zIndex: 5,
          borderTop:
            "1px solid rgba(255,255,255,.06)",
          background: "#04060c",
        }}
      >

        <div
          style={{
            maxWidth: 1400,
            margin: "auto",
            padding: "28px 45px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            color: "rgba(255,255,255,.2)",
            fontSize: 10,
          }}
        >

          <span>
            © 2026 CareerUp AI
          </span>

          <span>
            Career intelligence for what's next.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Register;
