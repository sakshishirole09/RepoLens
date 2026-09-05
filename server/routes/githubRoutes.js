const express = require("express");

const router = express.Router();

const githubController = require("../controllers/githubController");

// Repositories
router.get("/repos/:username", githubController.getRepositories);

// Repository Details
router.get("/repo/:username/:repo", githubController.getRepositoryDetails);

// Repository Contents
router.get("/contents/:username/:repo", githubController.getRepositoryContents);

// Project Detection
router.get("/detect/:username/:repo", githubController.detectProject);

// Health Score
router.get("/health/:username/:repo", githubController.getHealthScore);

// Languages
router.get("/languages/:username/:repo", githubController.getLanguages);

// README Analysis
router.get("/readme/:username/:repo", githubController.getReadmeAnalysis);

// Contributors
router.get("/contributors/:username/:repo", githubController.getContributors);

// Overall Score
router.get("/overall/:username/:repo", githubController.getOverallScore);

// Repository Stats
router.get("/stats/:username/:repo", githubController.getRepoStats);
router.get("/activity/:username/:repo", githubController.getActivityScore);
router.get("/risk/:username/:repo", githubController.getRiskScore);
router.get("/review/:username/:repo", githubController.generateReview);

module.exports = router;
