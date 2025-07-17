const mongoose = require("mongoose");

const developerToolSchema = new mongoose.Schema({
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
  description: {
    type: String,
  },
  deployed: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  keyFeatures: {
    type: [String],         // ✅ ADD THIS FIELD
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("DeveloperTool", developerToolSchema);
