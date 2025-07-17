const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

//  Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//  REGISTER USER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: " User registered successfully",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Registration failed", error: err.message });
  }
};

//  LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: " User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: " Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      message: " Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: " Login failed", error: err.message });
  }
};

//  ADMIN SIGNUP
const adminSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    const token = generateToken(newAdmin._id);
    res.status(201).json({ token, email: newAdmin.email });
  } catch (err) {
    res.status(500).json({ message: " Admin signup failed", error: err.message });
  }
};

//  ADMIN LOGIN
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ message: " Admin not found" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: " Invalid credentials" });

    const token = generateToken(admin._id);
    res.status(200).json({ token, email: admin.email });
  } catch (err) {
    res.status(500).json({ message: " Admin login failed", error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  adminSignup,
  adminLogin,
};
