const express = require("express");
const router = express.Router();
const DeveloperTool = require("../models/DeveloperTool");

// ✅ GET /api/tools?search=...&category=...&deployed=...&sort=...
router.get("/", async (req, res) => {
  const { search, category, deployed, sort } = req.query;

  const query = {};

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { name: regex },
      { vendor: regex },
      { tags: regex },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (deployed !== undefined) {
    query.deployed = deployed === "true";
  }

  const sortOption = {};
  if (sort === "asc") sortOption.name = 1;
  else if (sort === "desc") sortOption.name = -1;

  try {
    const tools = await DeveloperTool.find(query).sort(sortOption);
    res.status(200).json(tools);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ POST /api/tools - Add new tool (with keyFeatures)
router.post("/", async (req, res) => {
  try {
    const {
      name,
      vendor,
      category,
      deployed,
      tags,
      keyFeatures = [], // ✅ Optional key features
    } = req.body;

    const newTool = new DeveloperTool({
      name,
      vendor,
      category,
      deployed,
      tags,
      keyFeatures,
    });

    const savedTool = await newTool.save();
    res.status(201).json(savedTool);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
});

// ✅ PUT /api/tools/:id - Update tool (including keyFeatures)
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      vendor,
      category,
      deployed,
      tags,
      keyFeatures = [],
    } = req.body;

    const updatedTool = await DeveloperTool.findByIdAndUpdate(
      req.params.id,
      {
        name,
        vendor,
        category,
        deployed,
        tags,
        keyFeatures,
      },
      { new: true }
    );

    if (!updatedTool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    res.status(200).json(updatedTool);
  } catch (err) {
    res.status(400).json({ error: "Update failed", details: err.message });
  }
});

// ✅ DELETE /api/tools/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedTool = await DeveloperTool.findByIdAndDelete(req.params.id);
    if (!deletedTool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    res.status(200).json({ message: "Tool deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
