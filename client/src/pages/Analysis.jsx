import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import LanguageChart from "../components/LanguageChart" ;

const getScore = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : 0;
};

const getLanguageEntries = (raw) => {
  const source = raw?.languages ?? raw ?? {};

  if (Array.isArray(source)) {
    return source
      .map((item) => {
        const name = item.name || item.language || item.label;
        const value = Number(item.value ?? item.count ?? item.percentage ?? 0);
        return name ? { name, value } : null;
      })
      .filter(Boolean);
  }

  if (typeof source === "object" && source !== null) {
    return Object.entries(source)
      .map(([name, value]) => ({
        name,
        value: Number(value) || 0,
      }))
      .filter((item) => item.value > 0);
  }

  return [];
};

const Analysis = () => {
  const navigate = useNavigate();

  const saved = sessionStorage.getItem("codepulse_analysis");

  if (!saved) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border">
            <h1 className="text-2xl font-bold">No analysis found</h1>
            <p className="text-slate-500 mt-2">
              Please analyze a repository first.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-5 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  let savedData;

  try {
    savedData = JSON.parse(saved);
  } catch {
    sessionStorage.removeItem("codepulse_analysis");
    return null;
  }

  const { username, repo, analysis } = savedData;

  const overallScore = getScore(analysis?.overall?.overallScore);
  const communityScore = getScore(
    analysis?.overall?.breakdown?.communityScore
  );
  const activityScore = getScore(analysis?.activity?.activityScore);
  const riskScore = getScore(analysis?.risk?.riskScore);
  const healthScore = getScore(analysis?.health?.healthScore);
  const readmeScore = getScore(analysis?.readme?.readmeScore);

  const languages = useMemo(
    () => getLanguageEntries(analysis?.languages),
    [analysis?.languages]
  );

  const totalLanguageValue = languages.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const languageRows = languages.map((item) => ({
    ...item,
    percentage:
      totalLanguageValue > 0
        ? (item.value / totalLanguageValue) * 100
        : 0,
  }));

  const riskLabel =
    riskScore >= 75
      ? "High Risk"
      : riskScore >= 50
      ? "Moderate Risk"
      : "Low Risk";

  const findings = [];

  findings.push(
    communityScore >= 80
      ? `Strong community engagement with a score of ${communityScore}/100.`
      : `Community engagement can be improved (${communityScore}/100).`
  );

  findings.push(
    activityScore >= 80
      ? `The repository shows strong development activity (${activityScore}/100).`
      : `Development activity needs attention (${activityScore}/100).`
  );

  findings.push(
    readmeScore >= 80
      ? `README quality is good (${readmeScore}/100).`
      : `README documentation can be improved (${readmeScore}/100).`
  );

  findings.push(
    riskScore < 50
      ? `Current calculated risk is relatively low (${riskScore}/100).`
      : `Risk requires attention (${riskScore}/100).`
  );

  const recommendations = [];

  if (Array.isArray(analysis?.overall?.suggestions)) {
    recommendations.push(...analysis.overall.suggestions);
  }

  if (Array.isArray(analysis?.review?.suggestions)) {
    recommendations.push(...analysis.review.suggestions);
  }

  if (readmeScore < 80) {
    recommendations.push(
      "Improve README setup, usage examples and project documentation."
    );
  }

  if (riskScore >= 50) {
    recommendations.push(
      "Review unresolved maintenance and risk indicators."
    );
  }

  const uniqueRecommendations = [...new Set(recommendations)].slice(0, 6);

  const contributors = Array.isArray(analysis?.contributors?.contributors)
    ? analysis.contributors.contributors.slice(0, 5)
    : [];

  const maxContributions = Math.max(
    ...contributors.map((c) => Number(c.contributions) || 0),
    1
  );

  const exportPDF = async () => {
    try {
      const element = document.getElementById("analysis-report");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;
      const imageHeight = (canvas.height * pageWidth) / canvas.width;

      let y = 0;
      let remaining = imageHeight;

      pdf.addImage(imgData, "PNG", 0, y, pageWidth, imageHeight);
      remaining -= pageHeight;

      while (remaining > 0) {
        y -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, y, pageWidth, imageHeight);
        remaining -= pageHeight;
      }

      pdf.save(`${username}-${repo}-analysis.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
    }
  };

  const saveAnalysis = async () => {
    try {
      await API.post("/history", {
        owner: username,
        repository: repo,
        projectType: analysis.detect?.projectType,
        languages: analysis.languages?.languages,
        overallScore,
        grade: analysis.overall?.grade,
        healthScore,
        readmeScore,
        communityScore,
        activityScore,
        riskScore,
      });

      alert("Analysis Saved Successfully");
    } catch (error) {
      console.error(error);
      alert("Save Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div id="analysis-report" className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-indigo-600 font-semibold hover:underline w-fit"
            >
              ← Back to Dashboard
            </button>

            <div className="flex gap-3">
              <button
                onClick={saveAnalysis}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold"
              >
                Save Analysis
              </button>

              <button
                onClick={exportPDF}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Repository Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold">
                  {username}/{repo}
                </h1>
                <p className="text-indigo-100 mt-2">
                  {analysis.detect?.projectType || "GitHub Repository"}
                </p>

                <div className="flex flex-wrap gap-6 mt-5 text-sm">
                  <span>⭐ {analysis.stats?.stars ?? 0}</span>
                  <span>🍴 {analysis.stats?.forks ?? 0}</span>
                  <span>👀 {analysis.stats?.watchers ?? 0}</span>
                </div>
              </div>

              <a
                href={`https://github.com/${username}/${repo}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white/15 border border-white/30 hover:bg-white/25 px-5 py-3 rounded-xl font-semibold w-fit"
              >
                View on GitHub ↗
              </a>
            </div>
          </div>

          {/* Scores */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">
            <ScoreCard title="Repository Quality" value={overallScore} />
            <ScoreCard title="Community Score" value={communityScore} />
            <ScoreCard title="Activity Score" value={activityScore} />
            <ScoreCard title="Risk Score" value={riskScore} danger />
          </div>

          {/* Health */}
          <Section title="Repository Health">
            <div className="grid md:grid-cols-2 gap-6">
              <Progress title="Health Score" value={healthScore} />
              <Progress title="README Quality" value={readmeScore} />
            </div>

            <div className="mt-5 inline-flex bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold">
              Grade {analysis.overall?.grade || "N/A"}
            </div>
          </Section>

          {/* Findings */}
          <Section
            title="Key Findings"
            subtitle="Important signals identified from the repository analysis."
          >
            <div className="grid md:grid-cols-2 gap-4">
              {findings.map((finding, index) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700"
                >
                  <span className="font-bold text-indigo-600 mr-2">•</span>
                  {finding}
                </div>
              ))}
            </div>
          </Section>

          {/* Language chart - fixed, responsive CSS pie */}
          <Section
            title="Language Distribution"
            subtitle="Repository language composition."
          >
            {languageRows.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <div
                    className="w-64 h-64 md:w-72 md:h-72 rounded-full relative shadow-inner"
                    style={{
                      background: `conic-gradient(${buildConicGradient(
                        languageRows
                      )})`,
                    }}
                  >
                    <div className="absolute inset-1/4 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                      <span className="text-2xl font-bold text-slate-800">
                        {languageRows.length}
                      </span>
                      <span className="text-sm text-slate-500">
                        Languages
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {languageRows.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{
                            backgroundColor:
                              CHART_COLORS[index % CHART_COLORS.length],
                          }}
                        />
                        <span className="font-medium text-slate-700 truncate">
                          {item.name}
                        </span>
                      </div>

                      <span className="font-semibold text-slate-700 whitespace-nowrap">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Language data unavailable.</p>
            )}
          </Section>

          {/* Activity + Risk */}
          <div className="grid lg:grid-cols-2 gap-7">
            <Section title="Activity Overview">
              <p className="text-4xl font-bold text-slate-900">
                {activityScore}
                <span className="text-lg text-slate-400">/100</span>
              </p>
              <p className="text-slate-500 mt-2">
                Calculated repository activity score.
              </p>
              <div className="mt-6">
                <Progress title="Development Activity" value={activityScore} />
              </div>
            </Section>

            <Section title="Risk Analysis">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-4xl font-bold text-slate-900">
                    {riskScore}
                    <span className="text-lg text-slate-400">/100</span>
                  </p>
                  <p className="text-slate-500 mt-2">
                    Current calculated risk score.
                  </p>
                </div>

                <span className="bg-red-50 text-red-700 px-4 py-2 rounded-xl font-bold">
                  {riskLabel}
                </span>
              </div>

              <div className="mt-6">
                <Progress title="Risk Score" value={riskScore} />
              </div>
            </Section>
          </div>

          {/* Contributors */}
          <Section
            title="Top Contributors"
            subtitle="Most active contributors detected for this repository."
          >
            <div className="space-y-5">
              {contributors.length > 0 ? (
                contributors.map((c, index) => {
                  const contribution = Number(c.contributions) || 0;
                  const progress = (contribution / maxContributions) * 100;

                  return (
                    <div key={c.login || index} className="flex gap-4 items-center">
                      <div className="relative">
                        <img
                          src={c.avatarUrl}
                          alt={c.login}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute -top-2 -left-2 bg-slate-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold text-slate-800">
                            {c.login}
                          </span>
                          <span className="text-sm text-slate-500">
                            {contribution} contributions
                          </span>
                        </div>

                        <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-2 bg-indigo-500 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500">Contributor data unavailable.</p>
              )}
            </div>
          </Section>

          {/* README */}
          <Section
            title="README Quality"
            subtitle="Documentation quality based on the analyzer score."
          >
            <div className="max-w-xl">
              <Progress title="README Score" value={readmeScore} />
            </div>
          </Section>

          {/* Review */}
          <Section
            title="Repository Review"
            subtitle="Strengths and weaknesses returned by the current analyzer."
          >
            {analysis.review?.summary && (
              <div className="bg-slate-50 rounded-2xl p-5 text-slate-700">
                {analysis.review.summary}
              </div>
            )}

            {Array.isArray(analysis.review?.strengths) &&
              analysis.review.strengths.length > 0 && (
                <ReviewList
                  title="Strengths"
                  items={analysis.review.strengths}
                  positive
                />
              )}

            {Array.isArray(analysis.review?.weaknesses) &&
              analysis.review.weaknesses.length > 0 && (
                <ReviewList
                  title="Weaknesses"
                  items={analysis.review.weaknesses}
                />
              )}
          </Section>

          {/* Recommendations */}
          <Section
            title="Actionable Recommendations"
            subtitle="Suggested improvements based on the current analysis."
          >
            {uniqueRecommendations.length > 0 ? (
              <div className="space-y-3">
                {uniqueRecommendations.map((item, index) => (
                  <div
                    key={index}
                    className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-slate-700"
                  >
                    <span className="font-bold text-indigo-600 mr-2">
                      {index + 1}.
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">
                No additional recommendations were generated.
              </p>
            )}
          </Section>
        </div>
      </div>
    </>
  );
};

const CHART_COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#64748B",
];

const buildConicGradient = (rows) => {
  let current = 0;

  return rows
    .map((item, index) => {
      const start = current;
      current += item.percentage;

      return `${CHART_COLORS[index % CHART_COLORS.length]} ${start}% ${current}%`;
    })
    .join(", ");
};

const Section = ({ title, subtitle, children }) => (
  <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mt-7">
    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    {subtitle && <p className="text-slate-500 text-sm mt-1 mb-6">{subtitle}</p>}
    {!subtitle && <div className="mb-6" />}
    {children}
  </section>
);

const ScoreCard = ({ title, value, danger = false }) => (
  <div
    className={`rounded-3xl p-6 text-white shadow-sm ${
      danger
        ? "bg-gradient-to-r from-red-500 to-orange-600"
        : "bg-gradient-to-r from-indigo-500 to-purple-600"
    }`}
  >
    <p className="text-sm opacity-90">{title}</p>
    <p className="text-4xl font-bold mt-2">{value}</p>
    <p className="text-xs opacity-80 mt-1">out of 100</p>
  </div>
);

const Progress = ({ title, value }) => {
  const safe = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium text-slate-700">{title}</span>
        <span className="font-semibold text-slate-700">{safe}%</span>
      </div>

      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-3 bg-indigo-600 rounded-full"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
};

const ReviewList = ({ title, items, positive = false }) => (
  <div className="mt-6">
    <h3 className="font-bold text-slate-800 mb-3">{title}</h3>

    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`rounded-xl p-3 ${
            positive
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

export default Analysis;
