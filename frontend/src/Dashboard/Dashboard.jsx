import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const GOLD = "#D7B45A";
const GOLD_LIGHT = "#F0D98A";

function toProfile(user) {
  const asText = (value) =>
    Array.isArray(value) ? value.join(", ") : typeof value === "string" ? value : "";

  return {
    fullName: asText(user.name || user.fullName),
    education: asText(user.education),
    skills: asText(user.skills),
    interests: asText(user.careerInterests ?? user.interests),
    careerGoal: asText(user.careerGoal),
  };
}

function Dashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState({
    fullName: "",
    education: "",
    skills: "",
    interests: "",
    careerGoal: "",
  });

  // ===============================
  // LOAD USER
  // ===============================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      setProfile(toProfile(parsedUser));
    } catch (error) {
      console.error("User data error:", error);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }, []);

  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // SAVE PROFILE
  // ===============================
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        alert("Please login again.");
        window.location.href = "/login";
        return;
      }

      const loggedInUser = JSON.parse(savedUser);

      if (!loggedInUser.id) {
        alert("User ID not found. Please login again.");
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/users/profile/${loggedInUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile saved successfully!");

        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);

        setProfile(toProfile(data.user));

        setShowProfile(false);
      } else {
        alert(data.message || "Failed to save profile.");
      }
    } catch (error) {
      console.error("Profile error:", error);
      alert("Unable to connect to server.");
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // ===============================
  // PROFILE COMPLETION
  // ===============================
  const profileFields = [
    profile.fullName,
    profile.education,
    profile.skills,
    profile.interests,
    profile.careerGoal,
  ];

  const completedFields = profileFields.filter(
    (field) => field && field.trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  // ===============================
  // SKILLS
  // ===============================
  const skillsList = profile.skills
    ? profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  // ===============================
  // FIRST NAME
  // ===============================
  const displayName =
    profile.fullName ||
    user?.fullName ||
    user?.name ||
    "User";

  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#070A12] text-white">

      {/* =====================================================
          GLOBAL STYLES
      ===================================================== */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #070A12;
        }

        .glass {
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.09);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .glass-hover {
          transition: all .25s ease;
        }

        .glass-hover:hover {
          transform: translateY(-3px);
          border-color: rgba(215,180,90,.25);
          background: rgba(255,255,255,.065);
        }

        .gold-text {
          background: linear-gradient(
            100deg,
            #ffffff 0%,
            #f0d98a 45%,
            #d7b45a 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .grid-bg {
          background-image:
            linear-gradient(
              rgba(255,255,255,.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.025) 1px,
              transparent 1px
            );
          background-size: 60px 60px;
        }

        .gold-glow {
          box-shadow:
            0 0 0 1px rgba(215,180,90,.15),
            0 15px 40px rgba(215,180,90,.08);
        }

        .progress-ring {
          transform: rotate(-90deg);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .floating {
          animation: float 5s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: .4;
          }
          50% {
            opacity: .8;
          }
        }

        .pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }
      `}</style>

      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div
          className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full blur-[150px]"
          style={{
            background: "rgba(99,75,180,.16)",
          }}
        />

        <div
          className="absolute -right-40 top-[600px] h-[500px] w-[500px] rounded-full blur-[150px]"
          style={{
            background: "rgba(215,180,90,.08)",
          }}
        />

        <div
          className="pulse-glow absolute left-1/2 top-[850px] h-[400px] w-[400px] -translate-x-1/2 rounded-full blur-[150px]"
          style={{
            background: "rgba(85,72,210,.08)",
          }}
        />

      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="relative z-50 border-b border-white/[0.07] bg-[#070A12]/80 backdrop-blur-2xl">

        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
              style={{
                background: GOLD,
                color: "#080A10",
              }}
            >
              C
            </div>

            <div>
              <div className="text-[17px] font-semibold tracking-tight">
                CareerUp AI
              </div>

              <div className="text-[9px] uppercase tracking-[0.22em] text-white/30">
                Career Intelligence
              </div>
            </div>

          </div>

          {/* Desktop navigation */}

          <div className="hidden items-center gap-5 md:flex">

            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5">

              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: "#4ADE80",
                  boxShadow: "0 0 10px rgba(74,222,128,.6)",
                }}
              />

              <span className="text-xs text-white/50">
                AI Engine Online
              </span>

            </div>

            <button
              onClick={() => setShowProfile(true)}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/[0.05] hover:text-white"
            >
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl px-5 py-2.5 text-xs font-semibold text-[#080A10] transition hover:-translate-y-0.5"
              style={{
                background: GOLD,
              }}
            >
              Logout
            </button>

          </div>

          {/* Mobile menu */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-xl border border-white/10 p-2.5 md:hidden"
          >
            <div className="space-y-1.5">
              <span className="block h-px w-5 bg-white/70" />
              <span className="block h-px w-5 bg-white/70" />
              <span className="block h-px w-5 bg-white/70" />
            </div>
          </button>

        </div>

        {mobileMenu && (
          <div className="border-t border-white/[0.07] px-5 py-5 md:hidden">

            <div className="flex flex-col gap-3">

              <button
                onClick={() => {
                  setShowProfile(true);
                  setMobileMenu(false);
                }}
                className="rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-white/70"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#080A10]"
                style={{ background: GOLD }}
              >
                Logout
              </button>

            </div>

          </div>
        )}

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative z-10">

        {/* ===================================================
            WELCOME
        =================================================== */}

        <section className="grid-bg">

          <div className="mx-auto max-w-[1500px] px-5 pb-10 pt-10 sm:px-8 lg:pt-14">

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

              <div>

                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  Your Career Intelligence
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Welcome back,{" "}
                  <span className="gold-text">
                    {firstName}.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40 sm:text-base">
                  Your personalized career journey starts here.
                  CareerUp AI is ready to analyze your profile,
                  identify opportunities and help you plan your next move.
                </p>

              </div>

              {/* Readiness */}

              <div className="glass flex items-center gap-4 rounded-2xl px-5 py-4">

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: "rgba(215,180,90,.10)",
                    color: GOLD_LIGHT,
                  }}
                >
                  ✦
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Profile readiness
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {profileCompletion}%
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            DASHBOARD CONTENT
        =================================================== */}

        <section className="mx-auto max-w-[1500px] px-5 pb-20 sm:px-8">

          {/* =================================================
              TOP STATS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Career Readiness */}

            <div className="glass glass-hover rounded-3xl p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs text-white/35">
                    Career readiness
                  </p>

                  <p className="mt-2 text-4xl font-semibold">
                    {profileCompletion}%
                  </p>

                </div>

                <div className="relative h-16 w-16">

                  <svg
                    viewBox="0 0 64 64"
                    className="h-full w-full progress-ring"
                  >

                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="rgba(255,255,255,.06)"
                      strokeWidth="6"
                    />

                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke={GOLD}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${profileCompletion * 1.633} 163.3`}
                    />

                  </svg>

                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                    {profileCompletion}
                  </span>

                </div>

              </div>

              <p className="mt-4 text-[10px] text-white/25">
                Complete your profile to improve AI recommendations.
              </p>

            </div>

            {/* Skills */}

            <div className="glass glass-hover rounded-3xl p-6">

              <p className="text-xs text-white/35">
                Skills detected
              </p>

              <p className="mt-2 text-4xl font-semibold">
                {skillsList.length}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">

                {skillsList.length > 0 ? (
                  skillsList.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[9px] text-white/45"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-white/25">
                    Add skills to your profile
                  </span>
                )}

              </div>

            </div>

            {/* Career matches */}

            <div className="glass glass-hover rounded-3xl p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs text-white/35">
                    Career matches
                  </p>

                  <p
                    className="mt-2 text-4xl font-semibold"
                    style={{ color: GOLD_LIGHT }}
                  >
                    3
                  </p>

                </div>

                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
                  AI Ready
                </span>

              </div>

              <p className="mt-4 text-[10px] text-white/25">
                Potential career directions based on your profile.
              </p>

            </div>

            {/* Roadmap */}

            <div className="glass glass-hover rounded-3xl p-6">

              <p className="text-xs text-white/35">
                Career roadmap
              </p>

              <p className="mt-2 text-4xl font-semibold">
                90
                <span className="ml-1 text-base text-white/30">
                  days
                </span>
              </p>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                <div
                  className="h-full rounded-full"
                  style={{
                    width: "25%",
                    background: `linear-gradient(90deg,#6556C5,${GOLD})`,
                  }}
                />

              </div>

              <p className="mt-2 text-[10px] text-white/25">
                Your personalized growth plan
              </p>

            </div>

          </div>

          {/* =================================================
              PROFILE + AI INSIGHT
          ================================================= */}

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">

            {/* Profile */}

            <div className="glass rounded-3xl p-6 sm:p-7">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Career profile
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Your profile intelligence
                  </h2>

                </div>

                <button
                  onClick={() => setShowProfile(true)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/60 transition hover:bg-white/[0.05] hover:text-white"
                >
                  {profileCompletion === 100
                    ? "Update Profile"
                    : "Complete Profile"}
                </button>

              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">

                <ProfileItem
                  label="Education"
                  value={profile.education}
                />

                <ProfileItem
                  label="Career goal"
                  value={profile.careerGoal}
                />

                <ProfileItem
                  label="Interests"
                  value={profile.interests}
                />

                <ProfileItem
                  label="Skills"
                  value={
                    skillsList.length > 0
                      ? skillsList.join(", ")
                      : ""
                  }
                />

              </div>

            </div>

            {/* AI Insight */}

            <div className="glass gold-glow relative overflow-hidden rounded-3xl p-6">

              <div
                className="absolute -right-16 -top-16 h-40 w-40 rounded-full blur-[70px]"
                style={{
                  background: "rgba(215,180,90,.12)",
                }}
              />

              <div className="relative">

                <div className="flex items-center gap-3">

                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(215,180,90,.10)",
                      color: GOLD_LIGHT,
                    }}
                  >
                    ✦
                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      AI Career Insight
                    </p>

                    <p className="text-[10px] text-emerald-300">
                      Profile-aware recommendation
                    </p>

                  </div>

                </div>

                <p className="mt-6 text-sm leading-6 text-white/45">

                  {profile.careerGoal
                    ? `Your current goal is "${profile.careerGoal}". Complete your profile and CareerUp AI will identify the highest-value skills and opportunities for this direction.`
                    : "Complete your career profile so CareerUp AI can identify suitable career paths and recommend the skills you should focus on next."}

                </p>

                <button
                  onClick={() => setShowProfile(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#080A10]"
                  style={{ background: GOLD }}
                >
                  Improve my profile →
                </button>

              </div>

            </div>

          </div>

          {/* =================================================
              FEATURE CARDS
          ================================================= */}

          <div className="mt-12">

            <div className="mb-6">

              <p
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: GOLD }}
              >
                CareerUp AI Platform
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Your career intelligence tools
              </h2>

              <p className="mt-2 text-sm text-white/30">
                Use AI to understand where you are and decide what to do next.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <FeatureCard
                icon="🎯"
                title="Career Recommendations"
                description="Discover career paths based on your skills, education, interests and goals."
                button="Explore Careers"
                to="/careers"
              />

              <FeatureCard
                icon="📊"
                title="Skill Gap Analysis"
                description="Identify the most important skills you need to develop for your target career."
                button="Analyze Skills"
                to="/skill-gap"
              />

              <FeatureCard
                icon="📄"
                title="Resume Analyzer"
                description="Upload your resume and receive AI-powered suggestions to improve it."
                button="Analyze Resume"
                to="/resume"
              />

              <FeatureCard
                icon="🤖"
                title="AI Career Assistant"
                description="Ask career questions and get guidance based on your personal profile."
                button="Ask AI"
              />

            </div>

          </div>

          {/* =================================================
              CAREER INTELLIGENCE
          ================================================= */}

          <div className="mt-12 grid gap-5 lg:grid-cols-2">

            {/* Skills */}

            <div className="glass rounded-3xl p-6 sm:p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Skill intelligence
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Your current strengths
                  </h2>

                </div>

                <span
                  className="rounded-full px-3 py-1 text-[9px]"
                  style={{
                    color: GOLD_LIGHT,
                    background: "rgba(215,180,90,.08)",
                  }}
                >
                  AI ANALYSIS
                </span>

              </div>

              <div className="mt-7 space-y-5">

                <SkillBar
                  name="Technical Skills"
                  value={skillsList.length > 0 ? 82 : 0}
                />

                <SkillBar
                  name="Problem Solving"
                  value={skillsList.length > 0 ? 76 : 0}
                />

                <SkillBar
                  name="Communication"
                  value={skillsList.length > 0 ? 70 : 0}
                />

                <SkillBar
                  name="Career Readiness"
                  value={profileCompletion}
                />

              </div>

            </div>

            {/* Roadmap */}

            <div className="glass rounded-3xl p-6 sm:p-7">

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  Career roadmap
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Your next 90 days
                </h2>

              </div>

              <div className="mt-7 space-y-0">

                <RoadmapItem
                  number="01"
                  title="Complete your profile"
                  text="Add your education, skills, interests and career goal."
                  active
                />

                <RoadmapItem
                  number="02"
                  title="Analyze your skill gaps"
                  text="Understand which skills can improve your career fit."
                />

                <RoadmapItem
                  number="03"
                  title="Build targeted projects"
                  text="Create practical projects aligned with your target role."
                />

                <RoadmapItem
                  number="04"
                  title="Prepare for opportunities"
                  text="Improve your resume and practice interviews."
                />

              </div>

            </div>

          </div>

          {/* =================================================
              AI ASSISTANT PREVIEW
          ================================================= */}

          <div className="glass relative mt-12 overflow-hidden rounded-[30px]">

            <div
              className="absolute right-0 top-0 h-72 w-72 rounded-full blur-[110px]"
              style={{
                background: "rgba(105,87,200,.10)",
              }}
            />

            <div className="relative grid gap-10 p-6 sm:p-8 lg:grid-cols-[.8fr_1.2fr] lg:p-10">

              <div>

                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: GOLD }}
                >
                  Your always-on career coach
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
                  Ask better questions.
                  <br />
                  <span className="text-white/30">
                    Make better moves.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-6 text-white/35">
                  CareerUp AI can use your profile and career goals
                  to provide personalized guidance for your next move.
                </p>

                <button className="mt-7 rounded-xl px-5 py-3 text-xs font-semibold text-[#080A10]" style={{ background: GOLD }}>
                  Open AI Career Assistant →
                </button>

              </div>

              {/* Chat preview */}

              <div className="glass rounded-3xl p-5">

                <div className="flex items-center gap-3 border-b border-white/[0.07] pb-5">

                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(215,180,90,.1)",
                      color: GOLD_LIGHT,
                    }}
                  >
                    ✦
                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      CareerUp AI Coach
                    </p>

                    <p className="text-[10px] text-emerald-300">
                      Profile-aware guidance
                    </p>

                  </div>

                </div>

                <div className="mt-5 space-y-4">

                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-white/[0.06] p-4 text-xs leading-5 text-white/50">
                    What should I focus on next for my career?
                  </div>

                  <div className="max-w-[90%] rounded-2xl rounded-tl-md border border-white/[0.07] bg-[#080B13] p-4 text-xs leading-5 text-white/45">

                    {profile.careerGoal
                      ? `Based on your goal of becoming a ${profile.careerGoal.replace(
                          /^(Become a |become a )/i,
                          ""
                        )}, start by completing your profile and analyzing your current skill gaps.`
                      : "Complete your profile first. Once CareerUp AI understands your background and goals, it can provide a personalized career plan."}

                  </div>

                </div>

                <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white/20">
                  Ask CareerUp AI anything about your next move...
                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}

      {showProfile && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">

          <div className="glass max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] p-6 shadow-2xl sm:p-8">

            {/* Header */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: GOLD }}
                >
                  Career Intelligence
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Build your profile
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/35">
                  Give CareerUp AI the information it needs to personalize
                  your career recommendations.
                </p>

              </div>

              <button
                onClick={() => setShowProfile(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-xl text-white/40 transition hover:bg-white/[0.05] hover:text-white"
              >
                ×
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSaveProfile}
              className="mt-8 space-y-5"
            >

              <InputField
                label="Full Name"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />

              <InputField
                label="Education"
                name="education"
                value={profile.education}
                onChange={handleChange}
                placeholder="e.g. BCA, B.Tech, MCA"
              />

              <div>

                <label className="mb-2 block text-xs font-semibold text-white/60">
                  Skills
                </label>

                <textarea
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="e.g. Python, Java, React, SQL"
                  rows="3"
                  required
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#D7B45A]/50 focus:ring-2 focus:ring-[#D7B45A]/10"
                />

                <p className="mt-1.5 text-[10px] text-white/20">
                  Separate multiple skills with commas.
                </p>

              </div>

              <div>

                <label className="mb-2 block text-xs font-semibold text-white/60">
                  Interests
                </label>

                <textarea
                  name="interests"
                  value={profile.interests}
                  onChange={handleChange}
                  placeholder="e.g. Web Development, AI, Data Science"
                  rows="3"
                  required
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#D7B45A]/50 focus:ring-2 focus:ring-[#D7B45A]/10"
                />

                <p className="mt-1.5 text-[10px] text-white/20">
                  Separate multiple interests with commas.
                </p>

              </div>

              <InputField
                label="Career Goal"
                name="careerGoal"
                value={profile.careerGoal}
                onChange={handleChange}
                placeholder="e.g. Become a Full Stack Developer"
              />

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setShowProfile(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/50 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-[#080A10] transition hover:-translate-y-0.5"
                  style={{
                    background: GOLD,
                    boxShadow: "0 10px 30px rgba(215,180,90,.12)",
                  }}
                >
                  Save Profile
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-white/60">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#D7B45A]/50 focus:ring-2 focus:ring-[#D7B45A]/10"
      />

    </div>
  );
}

/* =========================================================
   PROFILE ITEM
========================================================= */

function ProfileItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

      <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
        {label}
      </p>

      <p className="mt-2 min-h-[20px] text-sm text-white/65">
        {value || "Not added yet"}
      </p>

    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
  button,
  to,
}) {
  return (
    <div className="glass glass-hover rounded-3xl p-6">

      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-xl">
          {icon}
        </div>

        <span className="text-[9px] text-white/20">
          AI
        </span>

      </div>

      <h3 className="mt-6 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/30">
        {description}
      </p>

      {to ? (
        <Link to={to} className="mt-5 inline-block text-xs font-semibold hover:opacity-80" style={{ color: GOLD_LIGHT }}>
          {button} →
        </Link>
      ) : (
        <button className="mt-5 text-xs font-semibold transition hover:opacity-80" style={{ color: GOLD_LIGHT }}>
          {button} →
        </button>
      )}

    </div>
  );
}

/* =========================================================
   SKILL BAR
========================================================= */

function SkillBar({ name, value }) {
  return (
    <div>

      <div className="mb-2 flex justify-between text-xs">

        <span className="text-white/40">
          {name}
        </span>

        <span className="text-white/65">
          {value}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: "linear-gradient(90deg,#6556C5,#D7B45A)",
          }}
        />

      </div>

    </div>
  );
}

/* =========================================================
   ROADMAP ITEM
========================================================= */

function RoadmapItem({
  number,
  title,
  text,
  active = false,
}) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">

      <div className="relative">

        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-[10px] font-semibold"
          style={{
            borderColor: active
              ? "rgba(215,180,90,.35)"
              : "rgba(255,255,255,.08)",
            background: active
              ? "rgba(215,180,90,.10)"
              : "rgba(255,255,255,.025)",
            color: active ? GOLD_LIGHT : "rgba(255,255,255,.35)",
          }}
        >
          {number}
        </div>

      </div>

      <div>

        <p className="text-sm font-semibold text-white/70">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/25">
          {text}
        </p>

      </div>

    </div>
  );
}

export default Dashboard;