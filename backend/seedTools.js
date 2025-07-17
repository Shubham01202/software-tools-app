require("dotenv").config();
const mongoose = require("mongoose");
const Tool = require("./models/Tool"); // adjust path if needed

const tools = [
  
      {
    name: "VS Code",
    vendor: "Microsoft",
    description: "Code editor for development",
    category: "Editor",
    tags: ["code", "editor", "dev"],
    deployed: true,
  },
  {
    name: "Postman",
    vendor: "Postman Inc",
    description: "API platform for developers",
    category: "DevOps",
    tags: ["api", "testing", "rest"],
    deployed: true,
  },
  {
    name: "GitHub",
    vendor: "GitHub",
    description: "Version control platform",
    category: "DevOps",
    tags: ["git", "repo", "versioning"],
    deployed: true,
  },
  {
    name: "Figma",
    vendor: "Figma",
    description: "Collaborative design tool for UI/UX",
    category: "Design",
    tags: ["ui", "ux", "collaboration"],
    deployed: true,
  },
  {
    name: "Docker Desktop",
    vendor: "Docker",
    description: "Run containers locally on your machine",
    category: "DevOps",
    tags: ["docker", "containers"],
    deployed: false,
  },
  {
    name: "Jira",
    vendor: "Atlassian",
    description: "Track project tasks and agile development",
    category: "Project Management",
    tags: ["project", "tasks", "agile"],
    deployed: false,
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB. Seeding tools...");

    await Tool.deleteMany(); // Optional: clears old data
    await Tool.insertMany(tools);

    console.log("✅ Tools inserted!");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
  });
