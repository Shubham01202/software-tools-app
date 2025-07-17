const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

// Protected route
router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({
    message: "Welcome to the protected dashboard ✅",
    user: req.user, // JWT-decoded user info
  });
});

module.exports = router;
