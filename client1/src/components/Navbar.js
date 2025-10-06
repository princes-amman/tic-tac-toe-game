import { Link } from "react-router-dom";

export default function Navbar({ stars }) {
  return (
    <nav className="bg-purple-700 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="flex space-x-4 font-bold text-lg">
        <Link to="/">Home</Link>
        <Link to="/game">Game</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>
      <div className="flex items-center space-x-2">
        <span>⭐ Stars: {stars}</span>
      </div>
    </nav>
  );
}
