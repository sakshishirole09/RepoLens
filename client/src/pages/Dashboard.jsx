import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const analyzeRepo = async () => {
    if (!username.trim() || !repo.trim()) {
      setErrorMessage("Please enter both GitHub username and repository name.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const owner = username.trim();
      const repository = repo.trim();

      const [
        detect,
        health,
        readme,
        languages,
        contributors,
        overall,
        stats,
        activity,
        risk,
        review,
      ] = await Promise.all([
        API.get(`/github/detect/${owner}/${repository}`),
        API.get(`/github/health/${owner}/${repository}`),
        API.get(`/github/readme/${owner}/${repository}`),
        API.get(`/github/languages/${owner}/${repository}`),
        API.get(`/github/contributors/${owner}/${repository}`),
        API.get(`/github/overall/${owner}/${repository}`),
        API.get(`/github/stats/${owner}/${repository}`),
        API.get(`/github/activity/${owner}/${repository}`),
        API.get(`/github/risk/${owner}/${repository}`),
        API.get(`/github/review/${owner}/${repository}`),
      ]);

      const result = {
        username: owner,
        repo: repository,
        analysis: {
          detect: detect.data,
          health: health.data,
          readme: readme.data,
          languages: languages.data,
          contributors: contributors.data,
          overall: overall.data,
          stats: stats.data,
          activity: activity.data,
          risk: risk.data,
          review: review.data,
        },
      };

      sessionStorage.setItem("codepulse_analysis", JSON.stringify(result));

      // Open the result on a separate application screen.
      window.location.href = "/analysis";
    } catch (error) {
      console.error("Analysis failed:", error);
      setErrorMessage(
        "Unable to analyze this repository. Check the repository name or GitHub API availability."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              CodePulse AI
            </h1>
            <p className="text-slate-500 mt-3 text-lg">
              Analyze GitHub repositories for health, activity, community and risk.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Analyze Repository
            </h2>

            <p className="text-slate-500 mt-1 mb-6">
              Enter a public GitHub owner and repository name.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  GitHub Username / Owner
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && analyzeRepo()}
                  placeholder="e.g. facebook"
                  className="w-full border border-slate-300 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Repository
                </label>
                <input
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && analyzeRepo()}
                  placeholder="e.g. react"
                  className="w-full border border-slate-300 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={analyzeRepo}
              disabled={loading}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition"
            >
              {loading ? "Analyzing Repository..." : "Analyze Repository"}
            </button>

            {loading && (
              <div className="mt-6 text-center">
                <div className="mx-auto w-9 h-9 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-500 mt-3">
                  Fetching GitHub data and calculating scores...
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 p-4">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
