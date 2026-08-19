import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./dashboard/Dashboard";

function App() {
  // Show Login page
  if (window.location.pathname === "/login") {
    return <Login />;
  }

  // Show Register page
  if (window.location.pathname === "/register") {
    return <Register />;
  }

  // Show Dashboard
  if (window.location.pathname === "/dashboard") {
    return <Dashboard />;
  }

  // Show Landing Page
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <div className="text-2xl font-extrabold">
            CareerUp <span className="text-indigo-600">AI</span>
          </div>

          <div className="flex items-center gap-6">

            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              How It Works
            </a>

            <button
              className="text-sm font-semibold text-indigo-600"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Login
            </button>

            <button
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Get Started
            </button>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-24 lg:flex-row">

          <div className="flex-1">

            <p className="mb-5 text-sm font-bold tracking-[0.2em] text-indigo-600">
              AI-POWERED CAREER PLATFORM
            </p>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Build Your Career.
              <br />
              <span className="text-indigo-600">
                Forge Your Future.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              CareerUp AI helps you discover the right career path,
              identify your skill gaps, improve your resume, and get
              personalized AI-powered career guidance.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <button
                className="rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                onClick={() => {
                  window.location.href = "/register";
                }}
              >
                Start Your Journey →
              </button>

              <a
                href="#features"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                Explore Features
              </a>

            </div>
          </div>

          {/* Career Analysis Card */}
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl shadow-slate-200">

            <div className="flex items-center justify-between">

              <span className="font-bold">
                Career Analysis
              </span>

              <span className="text-sm font-semibold text-emerald-600">
                ● AI Ready
              </span>

            </div>

            <div className="mt-8 flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                A
              </div>

              <div>
                <h3 className="font-bold">
                  Your Career Profile
                </h3>

                <p className="text-sm text-slate-500">
                  AI-powered analysis
                </p>
              </div>

            </div>

            <div className="mt-7 flex items-center justify-between rounded-xl bg-indigo-50 p-5">

              <div>

                <p className="text-sm text-slate-500">
                  Career Match
                </p>

                <h2 className="mt-1 text-4xl font-extrabold text-indigo-600">
                  87%
                </h2>

              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-indigo-600 font-bold text-indigo-600">
                87
              </div>

            </div>

            <div className="mt-6 flex flex-wrap gap-2">

              <span className="rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">
                JavaScript
              </span>

              <span className="rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">
                React
              </span>

              <span className="rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">
                Python
              </span>

              <span className="rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">
                MongoDB
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-white px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-center text-sm font-bold tracking-[0.2em] text-indigo-600">
            WHAT WE OFFER
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-center text-4xl font-extrabold">
            Everything You Need to Build Your Career
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="text-3xl">
                🎯
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Career Recommendations
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Discover career paths that match your skills,
                interests, education, and goals.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="text-3xl">
                📊
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Skill Gap Analysis
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Find the skills you are missing and get a
                personalized learning roadmap.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="text-3xl">
                📄
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Resume Analyzer
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Analyze your resume and receive AI-powered
                suggestions to improve it.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="text-3xl">
                🤖
              </div>

              <h3 className="mt-5 text-xl font-bold">
                AI Career Assistant
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Ask career questions and receive personalized
                guidance from your AI assistant.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-slate-50 px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-center text-sm font-bold tracking-[0.2em] text-indigo-600">
            HOW IT WORKS
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-center text-4xl font-extrabold">
            Your Career Journey in 4 Steps
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            <div>

              <div className="text-3xl font-extrabold text-indigo-600">
                01
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Create Profile
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Tell us about your education, skills and interests.
              </p>

            </div>

            <div>

              <div className="text-3xl font-extrabold text-indigo-600">
                02
              </div>

              <h3 className="mt-4 text-xl font-bold">
                AI Analysis
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Our AI analyzes your profile and career goals.
              </p>

            </div>

            <div>

              <div className="text-3xl font-extrabold text-indigo-600">
                03
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Get Roadmap
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Receive a personalized career and learning roadmap.
              </p>

            </div>

            <div>

              <div className="text-3xl font-extrabold text-indigo-600">
                04
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Build Your Future
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Track your progress and improve your career readiness.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="bg-slate-900 px-6 py-10 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="text-2xl font-extrabold">
            CareerUp <span className="text-indigo-400">AI</span>
          </div>

          <p className="mt-2 text-slate-400">
            AI-powered career guidance for the future.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;