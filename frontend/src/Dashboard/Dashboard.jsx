import { useState } from "react";

function Dashboard() {
  const [showProfile, setShowProfile] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    education: "",
    skills: "",
    interests: "",
    careerGoal: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      // Get logged-in user
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        alert("Please login again.");
        window.location.href = "/login";
        return;
      }

      const user = JSON.parse(savedUser);

      // Check user ID
      if (!user.id) {
        alert("User ID not found. Please login again.");
        window.location.href = "/login";
        return;
      }

      // Send profile to backend
      const response = await fetch(
        `http://localhost:5000/api/users/profile/${user.id}`,
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

        // Update user information in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setShowProfile(false);
      } else {
        alert(data.message || "Failed to save profile.");
      }
    } catch (error) {
      console.error("Profile error:", error);
      alert("Unable to connect to server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}
          <div className="text-2xl font-extrabold">
            CareerUp{" "}
            <span className="text-indigo-600">
              AI
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Main Dashboard */}
      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* Welcome Section */}
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

        {/* Create Profile Section */}
        <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Complete Your Profile
              </h2>

              <p className="mt-2 text-slate-600">
                Tell CareerUp AI about your education, skills,
                interests, and career goals.
              </p>

            </div>

            <button
              onClick={() => setShowProfile(true)}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
            >
              Create Profile →
            </button>

          </div>

        </div>

        {/* Feature Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Career Recommendations */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="text-3xl">
              🎯
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Career Recommendations
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Discover career paths based on your skills,
              education, interests, and goals.
            </p>

            <button className="mt-5 font-semibold text-indigo-600">
              Explore →
            </button>

          </div>

          {/* Skill Gap Analysis */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="text-3xl">
              📊
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Skill Gap Analysis
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Find the skills you need to develop for your
              target career.
            </p>

            <button className="mt-5 font-semibold text-indigo-600">
              Analyze →
            </button>

          </div>

          {/* Resume Analyzer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="text-3xl">
              📄
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Resume Analyzer
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Upload your resume and receive AI-powered
              improvement suggestions.
            </p>

            <button className="mt-5 font-semibold text-indigo-600">
              Analyze Resume →
            </button>

          </div>

          {/* AI Career Assistant */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="text-3xl">
              🤖
            </div>

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

      {/* Create Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-6">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-extrabold text-slate-900">
                  Create Your Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This information will help our AI understand
                  your career goals.
                </p>

              </div>

              <button
                onClick={() => setShowProfile(false)}
                className="text-2xl font-bold text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* Profile Form */}
            <form
              onSubmit={handleSaveProfile}
              className="mt-7 space-y-5"
            >

              {/* Full Name */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

              {/* Education */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Education
                </label>

                <input
                  type="text"
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  placeholder="e.g. BCA, B.Tech, MCA"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

              {/* Skills */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Skills
                </label>

                <textarea
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="e.g. Python, Java, React, SQL"
                  rows="3"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Separate multiple skills with commas.
                </p>

              </div>

              {/* Interests */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Interests
                </label>

                <textarea
                  name="interests"
                  value={profile.interests}
                  onChange={handleChange}
                  placeholder="e.g. Web Development, AI, Data Science"
                  rows="3"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Separate multiple interests with commas.
                </p>

              </div>

              {/* Career Goal */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Career Goal
                </label>

                <input
                  type="text"
                  name="careerGoal"
                  value={profile.careerGoal}
                  onChange={handleChange}
                  placeholder="e.g. Become a Full Stack Developer"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowProfile(false)}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
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

export default Dashboard;