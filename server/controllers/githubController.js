const axios = require("axios");
const analyzeHealth = require("../utils/healthAnalyzer");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const githubAPI = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

githubAPI.interceptors.request.use(
  (config) => {
    if (process.env.GITHUB_TOKEN) {
      config.headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

      console.log("GitHub Auth: TOKEN ATTACHED");
    } else {
      console.log("GitHub Auth: TOKEN MISSING");
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const githubError = (error, res) => {
  console.error("FULL ERROR:");

  if (error.response) {
    console.error("STATUS:", error.response.status);
    console.error("DATA:", error.response.data);
  } else {
    console.error(error.message);
  }

  return res.status(error?.response?.status || 500).json({
    message: error?.response?.data?.message || error.message,
  });
};

// =========================
// Repositories
// =========================

const getRepositories = async (req, res) => {
  try {
    const { username } = req.params;

    const response = await githubAPI.get(`/users/${username}/repos`);

    res.json(response.data);
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// Repository Details
// =========================

const getRepositoryDetails = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const response = await githubAPI.get(`/repos/${username}/${repo}`);

    res.json(response.data);
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// Repository Contents
// =========================

const getRepositoryContents = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const response = await githubAPI.get(`/repos/${username}/${repo}/contents`);

    res.json(response.data);
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// Detect Project
// =========================

const detectProject = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const response = await githubAPI.get(`/repos/${username}/${repo}/contents`);

    const files = response.data.map((item) => item.name);

    let projectType = "Unknown";

    if (files.includes("package.json")) {
      projectType = "JavaScript / Node.js";
    }

    if (files.includes("next.config.js")) {
      projectType = "Next.js";
    }

    if (files.includes("package.json") && files.includes("vite.config.js")) {
      projectType = "React + Vite";
    }

    if (files.includes("server.js")) {
      projectType = "Node.js + Express";
    }

    res.json({
      repository: repo,
      projectType,
      files,
    });
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// Health Score
// =========================
const getHealthScore = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const response = await githubAPI.get(`/repos/${username}/${repo}/contents`);

    const files = response.data.map((item) => item.name);

    const result = analyzeHealth(files);

    const suggestions = [];

    if (!files.includes("README.md")) {
      suggestions.push("Add README documentation.");
    }

    if (!files.includes("LICENSE")) {
      suggestions.push("Add LICENSE file.");
    }

    if (!files.includes("CONTRIBUTING.md")) {
      suggestions.push("Add contributing guidelines.");
    }

    if (suggestions.length === 0) {
      suggestions.push("Repository health looks excellent.");
    }

    res.json({
      repository: repo,
      healthScore: result.score,
      grade: result.grade,
      checks: result.checks,
      suggestions,
    });
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// Languages
// =========================

const getLanguages = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const response = await githubAPI.get(
      `/repos/${username}/${repo}/languages`,
    );

    res.json({
      repository: repo,
      languages: response.data,
    });
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// README Analysis
// =========================

const getReadmeAnalysis = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const response = await githubAPI.get(`/repos/${username}/${repo}/readme`, {
      headers: {
        Accept: "application/vnd.github.raw",
      },
    });

    const readme = response.data;

    let score = 0;

    if (/install/i.test(readme)) score += 25;
    if (/usage/i.test(readme)) score += 25;
    if (/license/i.test(readme)) score += 25;
    if (/contributing/i.test(readme)) score += 25;

    res.json({
      repository: repo,
      readmeScore: score,
      preview: readme.substring(0, 500),
    });
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// Contributors
// =========================

const getContributors = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const response = await githubAPI.get(
      `/repos/${username}/${repo}/contributors`,
    );

    res.json({
      repository: repo,
      totalContributors: response.data.length,
      contributors: response.data.map((c) => ({
        login: c.login,
        contributions: c.contributions,
        avatarUrl: c.avatar_url,
      })),
    });
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// Activity Score
// =========================

const getActivityScore = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const commits = await githubAPI.get(
      `/repos/${username}/${repo}/commits?per_page=100`,
    );

    const count = commits.data.length;

    res.json({
      activityScore: Math.min(100, 20 + count),
      recentCommits: count,
    });
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// Risk Score
// =========================

const getRiskScore = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const repoData = await githubAPI.get(`/repos/${username}/${repo}`);

    const issues = repoData.data.open_issues_count;

    const riskScore = Math.max(10, 100 - Math.floor(issues / 20));

    res.json({
      riskScore,
    });
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// Repo Stats
// =========================

const getRepoStats = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const response = await githubAPI.get(`/repos/${username}/${repo}`);

    res.json({
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      watchers: response.data.watchers_count,
      issues: response.data.open_issues_count,
      size: response.data.size,
      defaultBranch: response.data.default_branch,
    });
  } catch (error) {
    githubError(error, res);
  }
};

// =========================
// Overall Score
// =========================

const getOverallScore = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const contents = await githubAPI.get(`/repos/${username}/${repo}/contents`);

    const files = contents.data.map((f) => f.name);

    const health = analyzeHealth(files);

    const repoData = await githubAPI.get(`/repos/${username}/${repo}`);

    const contributors = await githubAPI.get(
      `/repos/${username}/${repo}/contributors`,
    );

    const commits = await githubAPI.get(
      `/repos/${username}/${repo}/commits?per_page=100`,
    );

    let readmeScore = 0;

    try {
      const readmeResponse = await githubAPI.get(
        `/repos/${username}/${repo}/readme`,
        {
          headers: {
            Accept: "application/vnd.github.raw",
          },
        },
      );

      const readme = readmeResponse.data;

      if (/install/i.test(readme)) readmeScore += 25;

      if (/usage/i.test(readme)) readmeScore += 25;

      if (/license/i.test(readme)) readmeScore += 25;

      if (/contributing/i.test(readme)) readmeScore += 25;
    } catch {
      readmeScore = 0;
    }

    const communityScore = Math.min(
      100,
      Math.round(
        (repoData.data.stargazers_count / 100000) * 40 +
          (repoData.data.forks_count / 50000) * 30 +
          (Math.min(contributors.data.length, 50) / 50) * 30,
      ),
    );

    const activityScore = Math.min(100, 20 + commits.data.length);

    const riskScore = Math.max(0, 100 - repoData.data.open_issues_count * 2);

    const overallScore = Math.round(
      health.score * 0.25 +
        communityScore * 0.35 +
        activityScore * 0.2 +
        readmeScore * 0.1 +
        riskScore * 0.1,
    );
    const suggestions = [];
    if (health.score < 80) {
      suggestions.push("Add README, LICENSE and documentation.");
    }

    if (activityScore < 50) {
      suggestions.push("Increase commit frequency and project activity.");
    }

    if (communityScore < 50) {
      suggestions.push("Promote the project to attract contributors.");
    }

    if (riskScore < 50) {
      suggestions.push("Reduce open issues and resolve bugs.");
    }

    if (readmeScore < 75) {
      suggestions.push("Improve installation and usage documentation.");
    }

    if (suggestions.length === 0) {
      suggestions.push("Repository is in excellent condition.");
    }

    res.json({
      repository: repo,
      overallScore,
      grade:
        overallScore >= 90
          ? "A"
          : overallScore >= 75
            ? "B"
            : overallScore >= 60
              ? "C"
              : "D",

      breakdown: {
        healthScore: health.score,
        communityScore,
        activityScore,
        readmeScore,
        riskScore,

      },

      suggestions,
    });
  } catch (error) {
    githubError(error, res);
  }
};
const generateReview = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const repoRes = await githubAPI.get(`/repos/${username}/${repo}`);

    const langRes = await githubAPI.get(`/repos/${username}/${repo}/languages`);

    const readmeRes = await githubAPI.get(`/repos/${username}/${repo}/readme`, {
      headers: {
        Accept: "application/vnd.github.raw",
      },
    });

    const prompt = `
Analyze this GitHub Repository.

Repository:
${repoRes.data.full_name}

Description:
${repoRes.data.description}

Stars:
${repoRes.data.stargazers_count}

Forks:
${repoRes.data.forks_count}

Open Issues:
${repoRes.data.open_issues_count}

Primary Language:
${repoRes.data.language}

Languages:
${JSON.stringify(langRes.data)}

README:

${readmeRes.data}

Generate JSON only.

{
"summary":"",
"strengths":[],
"weaknesses":[],
"suggestions":[],
"score":0
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      response_format: {
        type: "json_object",
      },
    });
    console.log("open ai response",completion)

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getRepositories,
  getRepositoryDetails,
  getRepositoryContents,
  detectProject,
  getHealthScore,
  getLanguages,
  getReadmeAnalysis,
  getContributors,
  getOverallScore,
  getRepoStats,
  getActivityScore,
  getRiskScore,
  generateReview, // <-- add this
};
