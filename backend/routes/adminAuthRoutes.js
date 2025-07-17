// routes/adminAuthRoutes.js

const express = require("express");
const { adminSignup, adminLogin } = require("../controllers/authControllers");

const router = express.Router();

//  Admin Signup Route
router.post("/signup", adminSignup);

//  Admin Login Route
router.post("/login", adminLogin);

module.exports = router;
