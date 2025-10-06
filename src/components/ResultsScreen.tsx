import React from "react";
import { Award, TrendingUp, Droplets, Sprout, Zap } from "lucide-react";
import { GameState } from "@/types/game";
import { calculateResults } from "@/utils/gameLogic";
import { CARDS } from "@/data/cards";
import Image from "next/image";
interface ResultsScreenProps {
  gameState: GameState;
  onRestart: () => void;
}

export default function ResultsScreen({
  gameState,
  onRestart,
}: ResultsScreenProps) {
  // Check if player lost
  const playerLost = gameState.loseReason && gameState.loseDetails;

  const { finalYield, grade, gradeColor, gradeMessage } =
    calculateResults(gameState);

  // Find most used cards
  const cardUsageArray = Object.entries(gameState.cardsUsedCount)
    .map(([cardId, count]) => ({
      card: CARDS.find((c) => c.id === cardId),
      count,
    }))
    .filter((item) => item.card)
    .sort((a, b) => b.count - a.count);

  const topCards = cardUsageArray.slice(0, 5);

  // Calculate NASA data usage
  const nasaCardsUsed = cardUsageArray
    .filter((item) => item.card?.type === "nasa_data")
    .reduce((sum, item) => sum + item.count, 0);

  const totalCardsPlayed = Object.values(gameState.cardsUsedCount).reduce(
    (sum, count) => sum + count,
    0
  );

  // No longer tracking combos since we removed the combo mechanic

  // Determine farming strategy
  const sustainabilityCards = cardUsageArray
    .filter(
      (item) =>
        item.card?.effects.sustainability &&
        item.card.effects.sustainability > 0
    )
    .reduce((sum, item) => sum + item.count, 0);

  const strategy =
    sustainabilityCards / totalCardsPlayed > 0.3
      ? "Sustainable & Eco-Friendly"
      : sustainabilityCards / totalCardsPlayed > 0.15
      ? "Balanced Approach"
      : "Production-Focused";

  return (
    <div className="w-full h-screen   overflow-auto relative">
      <Image
        src="/assets/intro-bg.png"
        alt="Background"
        width={5960}
        height={4238}
        className="fixed top-0 left-0 w-full h-full"
        style={{ objectFit: "contain", zIndex: 1 }}
      />
      <Image
        src="/assets/background-grass.png"
        alt="Background"
        width={5960}
        height={4238}
        className="fixed top-0 left-0 w-full h-full"
        style={{ objectFit: "cover", zIndex: 0 }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="backdrop-blur-2xl rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            {playerLost ? (
              <>
                <div className="mx-auto mb-4 text-red-500 text-6xl">⚠️</div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                  Farm Failed!
                </h1>
                <div className="text-4xl md:text-6xl font-bold text-red-600 mb-4">
                  {gameState.loseReason}
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-4">
                  <p className="text-lg text-red-800 font-medium mb-2">
                    What went wrong:
                  </p>
                  <p className="text-base text-red-700">
                    {gameState.loseDetails}
                  </p>
                </div>
                <p className="text-xl text-gray-700">
                  Don&apos;t give up! Try again with better resource management.
                </p>
              </>
            ) : (
              <>
                <Award className="mx-auto mb-4 text-yellow-500" size={64} />
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                  Season Complete!
                </h1>
                <div
                  className={`text-6xl md:text-8xl font-bold ${gradeColor} mb-2`}
                >
                  {grade}
                </div>
                <p className="text-xl md:text-2xl text-gray-700">
                  {gradeMessage}
                </p>
              </>
            )}
          </div>

          {/* Stats Grid */}
          <div className="w-full grid md:grid-cols-3 gap-6 mb-8">
            <div
              className={`p-6 rounded-xl text-center border-2 ${
                playerLost
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <Sprout
                className={`mx-auto mb-2 ${
                  playerLost ? "text-red-600" : "text-green-600"
                }`}
                size={32}
              />
              <p className="text-sm text-gray-600 mb-1">Final Yield</p>
              <p
                className={`text-3xl font-bold ${
                  playerLost ? "text-red-700" : "text-green-700"
                }`}
              >
                {finalYield.toFixed(0)} kg/ha
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {playerLost
                  ? "Crops failed before harvest"
                  : "Maximum possible: 10,000 kg/ha"}
              </p>
            </div>

            <div
              className={`p-6 rounded-xl text-center border-2 ${
                playerLost
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <Droplets
                className={`mx-auto mb-2 ${
                  playerLost ? "text-red-600" : "text-blue-600"
                }`}
                size={32}
              />
              <p className="text-sm text-gray-600 mb-1">Sustainability Score</p>
              <p
                className={`text-3xl font-bold ${
                  playerLost ? "text-red-700" : "text-blue-700"
                }`}
              >
                {gameState.sustainability.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {playerLost
                  ? "Environmental damage too severe"
                  : "Environmental impact rating"}
              </p>
            </div>

            <div
              className={`p-6 rounded-xl text-center border-2 ${
                playerLost
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <TrendingUp
                className={`mx-auto mb-2 ${
                  playerLost ? "text-red-600" : "text-green-600"
                }`}
                size={32}
              />
              <p className="text-sm text-gray-600 mb-1">Productivity Index</p>
              <p
                className={`text-3xl font-bold ${
                  playerLost ? "text-red-700" : "text-green-700"
                }`}
              >
                {gameState.productivityIndex.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {playerLost
                  ? "Crops died from poor conditions"
                  : `Productivity: ${gameState.productivityIndex.toFixed(
                      1
                    )}% | Crop Health: ${gameState.cropHealth.toFixed(2)}`}
              </p>
            </div>
          </div>

          {/* Card Usage Statistics */}
          <div className="w-full bg-purple-50 border-l-4 border-purple-500 p-6 mb-6">
            <h3 className="text-xl font-bold text-purple-900 mb-3">
              🃏 Card Strategy Analysis
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Total Cards Played:</strong> {totalCardsPlayed}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>NASA Data Usage:</strong> {nasaCardsUsed} cards (
                  {((nasaCardsUsed / totalCardsPlayed) * 100).toFixed(1)}%)
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Farming Strategy:</strong> {strategy}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Average Cards per Round:</strong>{" "}
                  {(totalCardsPlayed / gameState.round).toFixed(1)}
                </p>
              </div>
              <div className="bg-white rounded p-3">
                <p className="text-xs font-bold text-gray-900 mb-2">
                  Top 5 Most Used Cards:
                </p>
                {topCards.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center mb-1"
                  >
                    <span className="text-xs text-gray-700">
                      {item.card?.icon} {item.card?.name}
                    </span>
                    <span className="text-xs font-bold text-purple-700">
                      {item.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Round-by-Round Performance */}
          {gameState.roundOutcomes.length > 0 && (
            <div className="w-full bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
              <h3 className="text-xl font-bold text-yellow-900 mb-3">
                📊 Round-by-Round Performance
              </h3>
              <div className="space-y-3">
                {gameState.roundOutcomes.map((outcome, idx) => (
                  <div key={idx} className="bg-white rounded p-4 border-l-4">
                    <div className="flex justify-between items-start mb-2"></div>
                    <div className="flex gap-3 text-xs text-gray-600">
                      {outcome.effects.productivityIndex !== 0 && (
                        <span>
                          📈 {outcome.effects.productivityIndex > 0 ? "+" : ""}
                          {outcome.effects.productivityIndex.toFixed(1)}%
                        </span>
                      )}
                      {outcome.effects.sustainability !== 0 && (
                        <span>
                          🌱 {outcome.effects.sustainability > 0 ? "+" : ""}
                          {outcome.effects.sustainability.toFixed(1)}%
                        </span>
                      )}
                      {outcome.effects.soilMoisture !== 0 && (
                        <span>
                          💧 {outcome.effects.soilMoisture > 0 ? "+" : ""}
                          {outcome.effects.soilMoisture.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onRestart}
            className="mt-10 mx-auto self-center bg-[#fdc803] z-10 text-[#653200] text-2xl font-bold py-4 px-6 rounded-[24px] hover:scale-105 transition-all transform border-6 border-[#653200] hover:brightness-105 duration-300 cursor-pointer"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
