export default function Rewards({ starsEarned }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-yellow-400 p-5 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2">🎉 Correct Answer!</h2>
        <p>You earned {starsEarned} ⭐</p>
      </div>
    </div>
  );
}
