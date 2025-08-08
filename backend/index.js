require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Route imports
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const toolRoutes = require("./routes/toolRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const openaiRoutes = require("./routes/openaiRoutes");

const app = express();

// CORS for production
app.use(
  cors({
    origin: "https://software-tools-app-frontend.onrender.com",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/openai", openaiRoutes);

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
