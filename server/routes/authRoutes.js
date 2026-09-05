const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

// Test
router.get("/test", (req, res) => {
  res.json({
    message: "Auth Routes Working",
  });
});

// Register
router.post(
  "/register",
  registerUser
);

// Login
router.post(
  "/login",
  loginUser
);

// Profile
router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;