require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const githubRoutes = require("./routes/githubRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const historyRoutes = require("./routes/historyRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// -----------------------------
// Middleware
// -----------------------------
app.use(cors());
app.use(express.json());

// -----------------------------
// Routes
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/history", historyRoutes);

// -----------------------------
// Health Check
// -----------------------------
app.get("/", (req, res) => {
  res.status(200).send("CodePulse AI Backend Running");
});

// -----------------------------
// Error Handling
// -----------------------------
app.use(notFound);
app.use(errorHandler);

// -----------------------------
// Port
// -----------------------------
const PORT = process.env.PORT || 5000;

// -----------------------------
// Start Server
// -----------------------------
const startServer = async () => {
  try {
    // Check required environment variables
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("MONGO_URI loaded: YES");
    console.log(
      "GITHUB_TOKEN loaded:",
      process.env.GITHUB_TOKEN ? "YES" : "NO"
    );
    console.log(
      "OPENAI_API_KEY loaded:",
      process.env.OPENAI_API_KEY ? "YES" : "NO"
    );

    // Connect to MongoDB first
    await connectDB();

    console.log("MongoDB connection successful");

    // Start Express server only after MongoDB connects
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

