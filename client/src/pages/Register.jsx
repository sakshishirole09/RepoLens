import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getPasswordStrength = () => {
    const password = form.password;

    if (!password) return { label: "", width: 0 };

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", width: 25 };
    if (score === 2) return { label: "Fair", width: 50 };
    if (score === 3) return { label: "Good", width: 75 };

    return { label: "Strong", width: 100 };
  };

  const passwordStrength = getPasswordStrength();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-[28px] shadow-xl border border-slate-200 overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[650px]">
          {/* Brand Panel */}
          <div className="hidden lg:flex bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white p-10 xl:p-14 flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center font-bold text-xl">
                  CP
                </div>

                <div>
                  <h1 className="text-2xl font-bold">CodePulse AI</h1>
                  <p className="text-indigo-100 text-xs">
                    Repository Intelligence
                  </p>
                </div>
              </div>

              <div className="mt-20">
                <p className="text-indigo-100 text-sm font-medium mb-3">
                  GET STARTED
                </p>

                <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
                  Turn repository data into useful insights.
                </h2>

                <p className="text-indigo-100 mt-5 leading-7 max-w-md">
                  Create your account and keep your repository analyses,
                  history and reports in one place.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Feature text="Repository health analysis" />
              <Feature text="Community and activity insights" />
              <Feature text="Risk and documentation scores" />
              <Feature text="Analysis history and PDF reports" />
            </div>
          </div>

          {/* Register Form */}
          <div className="p-7 sm:p-10 md:p-12 flex flex-col justify-center">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold">
                CP
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  CodePulse AI
                </h1>
                <p className="text-xs text-slate-500">
                  Repository Intelligence
                </p>
              </div>
            </div>

            <div className="mb-7">
              <p className="text-indigo-600 font-semibold text-sm">
                CREATE ACCOUNT
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                Start with CodePulse AI
              </h2>

              <p className="text-slate-500 mt-2">
                Create your account to save and review repository analyses.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pr-16 text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {form.password && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-indigo-600 rounded-full transition-all"
                        style={{
                          width: `${passwordStrength.width}%`,
                        }}
                      />
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      Password strength:{" "}
                      <span className="font-semibold text-slate-700">
                        {passwordStrength.label}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setError("");
                      setConfirmPassword(e.target.value);
                    }}
                    autoComplete="new-password"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pr-16 text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-slate-500 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-0.5 accent-indigo-600"
                />
                <span>
                  I agree to use CodePulse AI responsibly and keep my
                  account credentials secure.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-indigo-200"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-slate-600 mt-7">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-bold hover:text-purple-600"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ text }) => (
  <div className="flex items-center gap-3 text-sm text-indigo-50">
    <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
      ✓
    </span>
    {text}
  </div>
);

export default Register;
