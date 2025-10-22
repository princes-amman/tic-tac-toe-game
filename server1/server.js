const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables first
dotenv.config();

const app = express();

// CORS configuration (using the more specific list from HEAD)
app.use(
  cors({
    origin: [
      "https://tic-tac-toe-game-2-ely7.onrender.com", // your deployed frontend
      "http://localhost:3000", // local frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// Middleware for JSON parsing
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Leaderboard Schema
const LeaderboardSchema = new mongoose.Schema({
  name: String,
  score: Number,
});
const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);

// Level data
const levels = [
  { level: 1, size: 3, question: "What comes next in the sequence: 1,2,3,?" },
  { level: 2, size: 4, question: "What is the capital of France?" },
  // ... add other levels as needed
];

// GET question by level
app.get("/api/levels/:levelNumber", (req, res) => {
  const levelNumber = parseInt(req.params.levelNumber);
  const level = levels.find((l) => l.level === levelNumber);
  if (!level) return res.status(404).json({ message: "Level not found" });
  res.json(level);
});

// POST: save new score (accumulate if player exists)
app.post("/api/leaderboard", async (req, res) => {
  try {
    const { name, score } = req.body;
    if (!name || score === undefined)
      return res.status(400).json({ message: "Missing name or score" });

    const existing = await Leaderboard.findOne({ name });
    if (existing) {
      existing.score += score;
      await existing.save();
      console.log("✅ Updated existing score:", existing);
      return res.json({ message: "✅ Score updated!", entry: existing });
    }

    const newEntry = new Leaderboard({ name, score });
    await newEntry.save();
    console.log("✅ Saved new score:", newEntry);
    res.json({ message: "✅ Score submitted!", entry: newEntry });
  } catch (err) {
    console.error("❌ Error saving score:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: fetch all scores
app.get("/api/leaderboard", async (req, res) => {
  try {
    const scores = await Leaderboard.find().sort({ score: -1 });
    res.json(scores);
  } catch (err) {
    console.error("❌ Error fetching leaderboard:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
