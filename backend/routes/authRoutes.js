const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authControllers"); // ✅ correct


// Register user route
router.post("/signup", registerUser);

// Login user route
router.post("/login", loginUser);

module.exports = router;
