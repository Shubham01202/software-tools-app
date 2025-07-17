// models/Tool.js
const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    vendor: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    // ❌ Removed description
    deployed: {
      type: Boolean,
      default: false,
    },
    tags: [String],

    // ✅ New field for AI-generated key features
    keyFeatures: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tool", toolSchema);
