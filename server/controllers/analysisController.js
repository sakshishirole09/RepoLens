const Analysis = require("../models/Analysis");

// Save Analysis
const saveAnalysis = async (req, res) => {
  try {
    const {
      owner,
      repository,
      projectType,
      healthScore,
      readmeScore,
      overallScore,
      languages,
    } = req.body;

    const analysis = await Analysis.create({
      userId: req.user.id,
      owner,
      repository,
      projectType,
      healthScore,
      readmeScore,
      overallScore,
      languages,
    });

    res.status(201).json({
      message: "Analysis saved successfully",
      analysis,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Get All Analysis History
const getAnalysisHistory = async (
  req,
  res
) => {
  try {
    const history = await Analysis.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Analysis
const getAnalysisById = async (
  req,
  res
) => {
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

    res.json(analysis);
  } catch (error) {
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