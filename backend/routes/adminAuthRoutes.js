// routes/adminAuthRoutes.js

const express = require("express");
const { adminSignup, adminLogin } = require("../controllers/authControllers");

const router = express.Router();
console.log("✅ adminAuthRoutes loaded")

//  Admin Signup Route
router.post("/signup", adminSignup);

//  Admin Login Route
router.post("/login", adminLogin);

module.exports = router;
