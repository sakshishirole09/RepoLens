const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    repository: {
      type: String,
      required: true,
    },

    owner: {
      type: String,
      required: true,
    },

    projectType: String,

    healthScore: Number,

    readmeScore: Number,

    overallScore: Number,

    languages: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);