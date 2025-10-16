const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB (local or Render)
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/quizgame";

mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));


// ✅ Schema
const LeaderboardSchema = new mongoose.Schema({
  name: String,
  score: Number,
});
const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);

// ✅ Level data
const levels = [
  { level: 1, size: 3, question: "What comes next in the sequence: 1,2,3,?" },
  { level: 2, size: 4, question: "What is the capital of France?" },
  { level: 3, size: 4, question: "Which is heavier: iron or cotton?" },
  { level: 4, size: 5, question: "How many hours in a day?" },
  { level: 5, size: 5, question: "What is 10 + 15?" },
  { level: 6, size: 5, question: "Which planet is known as Red Planet?" },
  { level: 7, size: 6, question: "How many continents are there?" },
  { level: 8, size: 6, question: "What color do you get by mixing red and blue?" },
  { level: 9, size: 6, question: "How many minutes in an hour?" },
  { level: 10, size: 7, question: "What is the opposite of 'cold'?" },
];

// ✅ API Routes
app.get("/api/levels/:levelNumber", (req, res) => {
  const levelNumber = parseInt(req.params.levelNumber);
  const level = levels.find(l => l.level === levelNumber);
  if (!level) return res.status(404).json({ message: "Level not found" });
  res.json(level);
});

app.post("/api/leaderboard", async (req, res) => {
  const { name, score } = req.body;
  const newEntry = new Leaderboard({ name, score });
  await newEntry.save();
  res.json({ message: "Score submitted!" });
});

app.get("/api/leaderboard", async (req, res) => {
  const topScores = await Leaderboard.find().sort({ score: -1 }).limit(10);
  res.json(topScores);
});

// ✅ Serve frontend (React build)
app.use(express.static(path.join(__dirname, "client1/build")));

// ✅ Catch-all route for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client1/build", "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
