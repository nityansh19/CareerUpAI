function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <div className="text-2xl font-extrabold">
            CareerUp <span className="text-indigo-600">AI</span>
          </div>

          <button
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Dashboard */}
      <main className="mx-auto max-w-7xl px-6 py-12">

        <div>
          <p className="text-sm font-bold tracking-wider text-indigo-600">
            CAREERUP AI
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
            Welcome to Your Career Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Your personalized career journey starts here. Explore your
            career options, identify skill gaps, improve your resume,
            and build your future.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl">🎯</div>

            <h2 className="mt-4 text-xl font-bold">
              Career Recommendations
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Discover career paths based on your skills, education,
              interests, and goals.
            </p>

            <button className="mt-5 font-semibold text-indigo-600">
              Explore →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl">📊</div>

            <h2 className="mt-4 text-xl font-bold">
              Skill Gap Analysis
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Find the skills you need to develop for your target career.
            </p>

            <button className="mt-5 font-semibold text-indigo-600">
              Analyze →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl">📄</div>

            <h2 className="mt-4 text-xl font-bold">
              Resume Analyzer
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Upload your resume and receive AI-powered improvement
              suggestions.
            </p>

            <button className="mt-5 font-semibold text-indigo-600">
              Analyze Resume →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl">🤖</div>

            <h2 className="mt-4 text-xl font-bold">
              AI Career Assistant
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ask questions and get personalized AI career guidance.
            </p>

            <button className="mt-5 font-semibold text-indigo-600">
              Ask AI →
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;