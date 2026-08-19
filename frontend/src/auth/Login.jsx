import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("Logging in...");

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
        setMessage("Login successful!");

        console.log("Login response:", data);

        // Save logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Go to Dashboard
        window.location.href = "/dashboard";
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">

        {/* Header */}
        <div className="text-center">

          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-500">
            Login to continue your CareerUp AI journey.
          </p>

        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          {/* Email */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          {/* Password */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"
          >
            Login
          </button>

        </form>

        {/* Message */}
        {message && (
          <p className="mt-5 text-center text-sm font-semibold text-indigo-600">
            {message}
          </p>
        )}

        {/* Register */}
        <p className="mt-6 text-center text-sm text-slate-500">

          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => {
              window.location.href = "/register";
            }}
            className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Create Account
          </button>

        </p>

      </div>

    </div>
  );
}

export default Login;