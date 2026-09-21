const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: String,
      required: true,
    },

    repository: {
      type: String,
      required: true,
    },

    projectType: {
      type: String,
    },

    healthScore: {
      type: Number,
    },

    readmeScore: {
      type: Number,
    },

    overallScore: {
      type: Number,
    },

    grade: {
      type: String,
    },

    communityScore: {
      type: Number,
    },

    activityScore: {
      type: Number,
    },

    riskScore: {
      type: Number,
    },

    languages: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Analysis", analysisSchema);
