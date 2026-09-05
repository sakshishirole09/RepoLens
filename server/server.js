require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const githubRoutes = require("./routes/githubRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const historyRoutes = require("./routes/historyRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

console.log("GITHUB_TOKEN loaded:", process.env.GITHUB_TOKEN ? "YES" : "NO");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/github", githubRoutes);

app.use("/api/analysis", analysisRoutes);

app.use("/api/history", historyRoutes);
app.use(notFound);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("CodePulse AI Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
