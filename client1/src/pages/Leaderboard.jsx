import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    axios.get("https://server1-7s0j.onrender.com/api/leaderboard")
      .then((res) => setScores(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 text-white">
      <Navbar stars={0} />

      <div className="p-8 text-center">
        <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg animate-pulse">
          🏆 Leaderboard
        </h1>

        {scores.length === 0 ? (
          <p className="text-lg">No scores yet. Play the game and be the first ⭐</p>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {scores.map((s, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-white text-black px-5 py-3 rounded-lg shadow-md transform transition hover:scale-105"
              >
                <span className="font-bold text-lg">
                  {idx + 1}. {s.name}
                </span>
                <span className="text-yellow-500 font-bold">
                  ⭐ {s.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
