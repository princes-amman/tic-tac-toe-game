const express = require("express");
const router = express.Router();

// Sample levels (10 levels with increasing difficulty + questions)
const levels = [
  {
    id: 1,
    difficulty: "Easy",
    gridSize: 3,
    question: "What is 2 + 2?",
    answer: "4"
  },
  {
    id: 2,
    difficulty: "Easy",
    gridSize: 3,
    question: "What color is the sky on a clear day?",
    answer: "blue"
  },
  {
    id: 3,
    difficulty: "Medium",
    gridSize: 4,
    question: "How many days are in a week?",
    answer: "7"
  },
  {
    id: 4,
    difficulty: "Medium",
    gridSize: 4,
    question: "Which planet is known as the Red Planet?",
    answer: "mars"
  },
  {
    id: 5,
    difficulty: "Hard",
    gridSize: 5,
    question: "What is 10 - 3?",
    answer: "7"
  },
  {
    id: 6,
    difficulty: "Hard",
    gridSize: 5,
    question: "Which gas do humans need to survive?",
    answer: "oxygen"
  },
  {
    id: 7,
    difficulty: "Very Hard",
    gridSize: 6,
    question: "What is the capital of France?",
    answer: "paris"
  },
  {
    id: 8,
    difficulty: "Very Hard",
    gridSize: 6,
    question: "How many legs does a spider have?",
    answer: "8"
  },
  {
    id: 9,
    difficulty: "Expert",
    gridSize: 7,
    question: "Which is the largest ocean on Earth?",
    answer: "pacific"
  },
  {
    id: 10,
    difficulty: "Expert",
    gridSize: 7,
    question: "What is 5 × 6?",
    answer: "30"
  }
];

// API route to fetch levels
router.get("/", (req, res) => {
  res.json(levels);
});

module.exports = router;

