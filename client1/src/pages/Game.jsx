// src/pages/Game.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Rewards from "../components/Rewards";

const QUESTIONS_BY_LEVEL = {
  1: [
    {
      q: "What's a common habit among very successful people?",
      options: ["They watch a lot of TV", "They read and learn constantly", "They avoid all social activities"],
      answerIndex: 1,
    },
  ],
  2: [
    {
      q: "Most successful people manage time by:",
      options: ["Ignoring schedules", "Using consistent routines", "Procrastinating"],
      answerIndex: 1,
    },
    {
      q: "Which helps long-term success more?",
      options: ["Short bursts of effort", "Consistent daily progress", "Random lucky events"],
      answerIndex: 1,
    },
  ],
  3: [
    {
      q: "What is a strong predictor of success?",
      options: ["Resilience after failure", "Never failing", "Always being lucky"],
      answerIndex: 0,
    },
    {
      q: "The best way to learn something complex is:",
      options: ["Give up quickly", "Break it into small steps", "Try everything at once"],
      answerIndex: 1,
    },
    {
      q: "Which habit is common among highly successful people?",
      options: ["Constant complaining", "Goal setting & reflection", "No planning"],
      answerIndex: 1,
    },
  ],
  4: [
    {
      q: "How do successful people usually handle failure?",
      options: ["They quit immediately", "They learn and adapt", "They blame others"],
      answerIndex: 1,
    },
    {
      q: "What daily practice improves focus?",
      options: ["Meditation", "Constant multitasking", "Sleeping late"],
      answerIndex: 0,
    },
    {
      q: "Which builds strong discipline?",
      options: ["Random effort", "Small daily habits", "Waiting for motivation"],
      answerIndex: 1,
    },
    {
      q: "What do successful leaders encourage?",
      options: ["Open communication", "Ignoring teamwork", "Only working alone"],
      answerIndex: 0,
    },
  ],
  5: [
    {
      q: "What’s more effective for goals?",
      options: ["Writing them down", "Keeping them secret", "Never setting goals"],
      answerIndex: 0,
    },
    {
      q: "Successful people treat challenges as:",
      options: ["Opportunities to grow", "Reasons to quit", "Unnecessary stress"],
      answerIndex: 0,
    },
    {
      q: "Which improves productivity?",
      options: ["Taking breaks", "Working nonstop", "Checking phone all the time"],
      answerIndex: 0,
    },
    {
      q: "Why is networking important?",
      options: ["It creates luck & opportunities", "It wastes time", "It’s unnecessary"],
      answerIndex: 0,
    },
    {
      q: "What’s key to mastering a skill?",
      options: ["Practice & feedback", "Natural talent only", "Giving up if hard"],
      answerIndex: 0,
    },
  ],
  6: [
    {
      q: "Which mindset leads to growth?",
      options: ["Fixed mindset", "Growth mindset", "No mindset"],
      answerIndex: 1,
    },
    {
      q: "How do successful people manage health?",
      options: ["Ignore it", "Balance exercise & diet", "Rely on luck"],
      answerIndex: 1,
    },
    {
      q: "What’s the role of curiosity?",
      options: ["Leads to innovation", "Distracts from work", "Not important"],
      answerIndex: 0,
    },
    {
      q: "Which habit improves creativity?",
      options: ["Journaling & reflection", "Copying others", "Avoiding new ideas"],
      answerIndex: 0,
    },
    {
      q: "How do achievers handle criticism?",
      options: ["Learn from it", "Get discouraged", "Ignore everything"],
      answerIndex: 0,
    },
    {
      q: "What matters more for success?",
      options: ["Consistency & effort", "Being lucky", "Waiting for the right time"],
      answerIndex: 0,
    },
  ],
  7: [
    {
      q: "What’s the ultimate driver of success?",
      options: ["Passion & persistence", "Luck only", "Connections only"],
      answerIndex: 0,
    },
    {
      q: "Why do successful people keep learning?",
      options: ["To stay relevant & grow", "To waste time", "To avoid work"],
      answerIndex: 0,
    },
    {
      q: "What’s the benefit of patience?",
      options: ["Achieves long-term results", "Delays progress", "Has no benefit"],
      answerIndex: 0,
    },
    {
      q: "Which is more powerful?",
      options: ["Vision with action", "Action without vision", "No action at all"],
      answerIndex: 0,
    },
    {
      q: "How do top performers plan goals?",
      options: ["SMART goals (specific, measurable...)", "Vague wishes", "No planning"],
      answerIndex: 0,
    },
    {
      q: "What’s the main purpose of failure?",
      options: ["Teaches lessons", "Shows weakness", "Should be avoided forever"],
      answerIndex: 0,
    },
    {
      q: "Which creates lasting success?",
      options: ["Discipline & habits", "One-time effort", "Pure talent"],
      answerIndex: 0,
    },
  ],
};


const MAX_LEVEL = 7;

export default function Game() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [playersSet, setPlayersSet] = useState(false);

  const [level, setLevel] = useState(1);
  const boardSize = useMemo(() => level + 2, [level]);

  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isTie, setIsTie] = useState(false);

  const [showReward, setShowReward] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionQueue, setQuestionQueue] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lockedLevels, setLockedLevels] = useState(() => {
    const locks = Array(MAX_LEVEL + 1).fill(true);
    locks[1] = false;
    return locks;
  });

  const [stars, setStars] = useState({ X: 0, O: 0 });

  useEffect(() => {
    resetBoard();
    // eslint-disable-next-line
  }, [boardSize]);

  function resetBoard() {
    setBoard(Array(boardSize * boardSize).fill(""));
    setCurrentPlayer("X");
    setWinner(null);
    setIsTie(false);
  }

  function handleClick(idx) {
    if (board[idx] || winner) return;

    const newBoard = board.slice();
    newBoard[idx] = currentPlayer;
    setBoard(newBoard);

    const maybe = checkWinner(newBoard, boardSize, currentPlayer);
    if (maybe) {
      const winPlayer = currentPlayer;
      setWinner(winPlayer);
      setShowReward(true);
      setStars((s) => ({ ...s, [winPlayer]: (s[winPlayer] || 0) + 1 }));
      saveWinnerToLeaderboard(winPlayer);
      setTimeout(() => {
        setShowReward(false);
        prepareQuestionsForNextLevel();
      }, 1500);
    } else {
      if (newBoard.every((cell) => cell !== "")) {
        setIsTie(true);
      } else {
        setCurrentPlayer((p) => (p === "X" ? "O" : "X"));
      }
    }
  }

  async function saveWinnerToLeaderboard(winPlayer) {
    const name = winPlayer === "X" ? player1 || "Player X" : player2 || "Player O";
    const score = 1;
    try {
      await axios.post("https://server1-7s0j.onrender.com/api/leaderboard", { name, score });
    } catch (err) {
      console.error("Error saving leaderboard:", err);
    }
  }

  function prepareQuestionsForNextLevel() {
    const nextLevel = level + 1;
    if (nextLevel > MAX_LEVEL) {
      setQuestionQueue([]);
      setShowQuestionModal(false);
      return;
    }
    const requiredCount = nextLevel;
    const pool = QUESTIONS_BY_LEVEL[nextLevel] || QUESTIONS_BY_LEVEL[level] || QUESTIONS_BY_LEVEL[1] || [];
    const prepared = [];
    for (let i = 0; i < requiredCount; i++) {
      prepared.push(pool[i % pool.length]);
    }
    setQuestionQueue(prepared);
    setCurrentQuestionIndex(0);
    setShowQuestionModal(true);
  }

  function handleAnswer(selectedIndex) {
    const currentQ = questionQueue[currentQuestionIndex];
    if (!currentQ) return;

    if (selectedIndex === currentQ.answerIndex) {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex >= questionQueue.length) {
        const nextLevel = Math.min(level + 1, MAX_LEVEL);
        const newLocks = [...lockedLevels];
        newLocks[nextLevel] = false;
        setLockedLevels(newLocks);
        setShowQuestionModal(false);
        setLevel(nextLevel);
        resetBoard();
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
    } else {
      alert("Wrong answer — try again to unlock the next level!");
    }
  }

  function checkWinner(bd, n, playerSymbol) {
    for (let r = 0; r < n; r++) {
      let full = true;
      for (let c = 0; c < n; c++) {
        if (bd[r * n + c] !== playerSymbol) {
          full = false;
          break;
        }
      }
      if (full) return { type: "row", index: r };
    }

    for (let c = 0; c < n; c++) {
      let full = true;
      for (let r = 0; r < n; r++) {
        if (bd[r * n + c] !== playerSymbol) {
          full = false;
          break;
        }
      }
      if (full) return { type: "col", index: c };
    }

    let fullDiag = true;
    for (let i = 0; i < n; i++) {
      if (bd[i * n + i] !== playerSymbol) {
        fullDiag = false;
        break;
      }
    }
    if (fullDiag) return { type: "diag", which: "main" };

    let fullAnti = true;
    for (let i = 0; i < n; i++) {
      if (bd[i * n + (n - 1 - i)] !== playerSymbol) {
        fullAnti = false;
        break;
      }
    }
    if (fullAnti) return { type: "diag", which: "anti" };

    return null;
  }

  // ✅ Updated renderSquare with no gaps, white boxes, visible borders
  function renderSquare(i) {
    return (
      <button
        key={i}
        onClick={() => handleClick(i)}
        className={`w-20 h-20 flex items-center justify-center text-4xl font-extrabold border border-gray-600 bg-white
          ${board[i] ? "cursor-default" : "hover:scale-105 hover:bg-gray-100"}
          ${board[i] === "X" ? "text-purple-700" : "text-pink-700"}`}
      >
        {board[i]}
      </button>
    );
  }

  function startGame(e) {
    e.preventDefault();
    setPlayersSet(true);
    resetBoard();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 text-white">
      <Navbar stars={(stars.X || 0) + (stars.O || 0)} />

      <div className="max-w-4xl mx-auto p-6">
        {!playersSet ? (
          <form onSubmit={startGame} className="bg-white/10 p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-2xl font-bold">Enter player names</h2>
            <div className="flex gap-4">
              <input
                className="flex-1 p-3 rounded-md text-black"
                placeholder="Player 1 (X)"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                required
              />
              <input
                className="flex-1 p-3 rounded-md text-black"
                placeholder="Player 2 (O)"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Levels: {level} / {MAX_LEVEL}</p>
                <p className="text-sm">Board size: {boardSize} x {boardSize}</p>
              </div>
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-md font-bold">Start</button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Level {level} — {boardSize}×{boardSize}</h2>
                <p className="text-sm opacity-90">
                  {player1 || "Player X"} (X) vs {player2 || "Player O"} (O)
                </p>
              </div>
              <div className="space-x-3">
                <button onClick={() => setPlayersSet(false)} className="bg-white/20 px-3 py-2 rounded-md">
                  Change Players
                </button>
                <button onClick={resetBoard} className="bg-white/20 px-3 py-2 rounded-md">
                  Reset Board
                </button>
              </div>
            </div>

            {/* ✅ Updated board container (no gap) */}
            <div
              className="bg-white/5 p-4 rounded-2xl shadow-inner flex justify-center"
            >
              <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${boardSize}, auto)` }}
              >
                {board.map((_, i) => renderSquare(i))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                {winner ? (
                  <div className="text-lg font-bold">
                    🎉 {winner === "X" ? player1 || "Player X" : player2 || "Player O"} wins!
                  </div>
                ) : isTie ? (
                  <div className="text-lg font-bold">It's a tie! Try again.</div>
                ) : (
                  <div className="text-lg">Turn: {currentPlayer === "X" ? (player1 || "Player X") : (player2 || "Player O")}</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm">Stars — {player1 || "Player X"}: {stars.X || 0}</div>
                <div className="text-sm">Stars — {player2 || "Player O"}: {stars.O || 0}</div>
              </div>
            </div>

            <div className="mt-6 bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Levels</h3>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: MAX_LEVEL }, (_, i) => {
                  const lvl = i + 1;
                  const locked = lockedLevels[lvl];
                  return (
                    <div key={lvl} className={`px-3 py-1 rounded-md ${lvl === level ? "bg-yellow-400 text-black" : "bg-white/10 text-white"}`}>
                      Level {lvl} {locked ? "🔒" : "🔓"}
                    </div>
                  );
                })}
              </div>
            </div>

            {level >= MAX_LEVEL && !winner && (
              <div className="mt-6 bg-white/10 p-4 rounded-lg text-center">
                <h3 className="font-bold">✨ You've unlocked the top level!</h3>
                <p>Play well and collect more stars. Great job.</p>
              </div>
            )}
          </>
        )}
      </div>

      {showReward && <Rewards starsEarned={1} />}

      {showQuestionModal && questionQueue.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-xl w-full text-black">
            <h3 className="text-xl font-bold mb-3">Answer to unlock Level {Math.min(level + 1, MAX_LEVEL)}</h3>
            <p className="mb-4 text-sm">Question {currentQuestionIndex + 1} of {questionQueue.length}</p>
            <div className="mb-4">
              <p className="font-semibold">{questionQueue[currentQuestionIndex].q}</p>
              <div className="mt-3 grid gap-2">
                {questionQueue[currentQuestionIndex].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="text-left p-3 rounded-md border hover:scale-105 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {level >= MAX_LEVEL && winner && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-yellow-400 p-6 rounded-xl text-black text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p>You reached Level {MAX_LEVEL} — fantastic!</p>
            <button
              onClick={() => {
                setLevel(1);
                setLockedLevels((locks) => {
                  const n = Array(MAX_LEVEL + 1).fill(true);
                  n[1] = false;
                  return n;
                });
                setStars({ X: 0, O: 0 });
                resetBoard();
              }}
              className="mt-4 px-4 py-2 rounded-md bg-black text-yellow-400 font-bold"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
