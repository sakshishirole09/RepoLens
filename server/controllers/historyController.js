const Analysis = require("../models/Analysis");

const saveAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.create(req.body);

    res.status(201).json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await Analysis.find().sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveAnalysis,
  getHistory,
};
