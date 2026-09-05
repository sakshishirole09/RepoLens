const express = require("express");
const router = express.Router();

const {
  saveAnalysis,
  getHistory,
} = require("../controllers/historyController");

router.post("/", saveAnalysis);
router.get("/", getHistory);

module.exports = router;