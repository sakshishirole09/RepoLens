const Analysis = require("../models/Analysis");

// =====================================================
// SAVE ANALYSIS
// =====================================================

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

    const analysis = await Analysis.create({
      // IMPORTANT:
      // Never take userId from frontend.
      // Get it from authenticated JWT.
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

// =====================================================
// GET USER HISTORY
// =====================================================

const getAnalysisHistory = async (req, res) => {
  try {
    const history = await Analysis.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(history);
  } catch (error) {
    console.error("Get history error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET SINGLE ANALYSIS
// =====================================================

const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,

      // IMPORTANT:
      // User can only access
      // their own analysis.
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
