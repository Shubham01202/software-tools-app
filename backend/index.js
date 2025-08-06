require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Route imports
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const toolRoutes = require("./routes/toolRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes"); // ✅ Admin route
const openaiRoutes = require("./routes/openaiRoutes"); // ✅ OpenAI route

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
// app.get("/", (req, res) => {
//   res.send(" API is working");
// });

// Routes
app.use("/api/auth", authRoutes); // Regular user auth (if needed)
app.use("/api/protected", protectedRoutes); // JWT-protected routes
app.use("/api/tools", toolRoutes); // Developer tools
app.use("/api/admin", adminAuthRoutes); // Admin login/signup routes
app.use("/api/openai", openaiRoutes); // ✅ Chat with OpenAI

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
  });
