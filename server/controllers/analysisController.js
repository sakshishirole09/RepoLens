const Analysis = require("../models/Analysis");

// SAVE ANALYSIS
const saveAnalysis = async (req, res) => {
  try {
    const {
      owner,
      repository,
      projectType,
      healthScore,
      readmeScore,
      overallScore,
      grade,
      communityScore,
      activityScore,
      riskScore,
      languages,
    } = req.body;

    // IMPORTANT:
    // Never accept userId from the frontend.
    // Get it from the authenticated JWT.
    const analysis = await Analysis.create({
      userId: req.user.id,

      owner,
      repository,
      projectType,
      healthScore,
      readmeScore,
      overallScore,
      grade,
      communityScore,
      activityScore,
      riskScore,
      languages,
    });

    res.status(201).json({
      message: "Analysis saved successfully",
      analysis,
    });
  } catch (error) {
    console.error("Save analysis error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ONLY LOGGED-IN USER'S HISTORY
const getAnalysisHistory = async (req, res) => {
  try {
    console.log("Logged-in user ID:", req.user.id);

    const history = await Analysis.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    console.log("History records returned:", history.length);

    res.status(200).json(history);
  } catch (error) {
    console.error("Get history error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ONE ANALYSIS
// Also verifies that the analysis belongs to the logged-in user.
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error("Get analysis error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
};
