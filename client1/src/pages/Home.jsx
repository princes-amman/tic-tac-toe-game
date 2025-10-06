import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-400 to-pink-400 text-white">
      <h1 className="text-5xl font-bold mb-6 animate-bounce">Tic-Tac-Toe Challenge</h1>
      <p className="mb-6 text-lg">Win levels, answer questions & collect stars!</p>
      <div className="space-x-4">
        <Link to="/game" className="bg-yellow-400 px-6 py-3 rounded-lg text-black font-bold hover:bg-yellow-500">Start Game</Link>
        <Link to="/leaderboard" className="bg-white px-6 py-3 rounded-lg text-black font-bold hover:bg-gray-200">Leaderboard</Link>
      </div>
    </div>
  );
}
