import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      login(data);
      navigate("/");
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-[28px] shadow-xl border border-slate-200 overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[620px]">
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
                  WELCOME BACK
                </p>

                <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
                  Understand your codebase at a glance.
                </h2>

                <p className="text-indigo-100 mt-5 leading-7 max-w-md">
                  Analyze repository health, activity, community, risk and
                  documentation quality from one dashboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MiniStat value="Health" label="Repository" />
              <MiniStat value="Risk" label="Insights" />
              <MiniStat value="PDF" label="Reports" />
            </div>
          </div>

          {/* Login Form */}
          <div className="p-7 sm:p-10 md:p-12 flex flex-col justify-center">
            <div className="lg:hidden flex items-center gap-3 mb-10">
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

            <div className="mb-8">
              <p className="text-indigo-600 font-semibold text-sm">SIGN IN</p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                Welcome back
              </h2>

              <p className="text-slate-500 mt-2">
                Sign in to continue analyzing your repositories.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-5">
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pr-16 text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-indigo-600"
                  />
                  Remember me
                </label>

                <span className="text-slate-400 cursor-not-allowed">
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-indigo-200"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-xs text-slate-400">NEW TO CODEPULSE?</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <p className="text-center text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-bold hover:text-purple-600"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ value, label }) => (
  <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
    <p className="font-bold">{value}</p>
    <p className="text-xs text-indigo-100 mt-1">{label}</p>
  </div>
);

export default Login;
