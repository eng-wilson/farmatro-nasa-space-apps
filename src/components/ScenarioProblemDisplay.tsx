import { Card } from "@/data/cards";
import { CardEffects, GameState, Penalty } from "@/types/game";
import { calculateCropHealthChange } from "@/utils/gameLogic";
import React from "react";

interface ScenarioProblemDisplayProps {
  selectedCards: Card[];
  cardEffects: CardEffects;
  gameState: GameState;
  onEffectsComplete: () => void;
  penalties?: Penalty[];
}

const ScenarioProblemDisplay = ({
  selectedCards,
  cardEffects,
  gameState,
  onEffectsComplete,
  penalties = [],
}: ScenarioProblemDisplayProps) => {
  const cropHealthChange = calculateCropHealthChange(gameState, cardEffects);
  return (
    <div className="z-30 text-center">
      {/* Played Cards */}

      <div className="mb-6 mt-12">
        <h2 className="text-4xl font-bold text-yellow-300 mb-2 drop-shadow-lg">
          Cards Played!
        </h2>
      </div>

      <div className="flex justify-center items-center gap-3 mb-6">
        {selectedCards.map((card, idx) => {
          return (
            <div
              key={`${idx}-${card.id}`}
              className="transform transition-all duration-500 animate-in relative"
              style={{
                animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`,
              }}
            >
              <div className="w-24 h-36 rounded-lg shadow-2xl border-2 p-2 flex flex-col items-center justify-center bg-white border-green-400">
                <div className="text-3xl mb-1">{card.icon}</div>
                <div className="text-[9px] font-bold text-center line-clamp-2 text-gray-900">
                  {card.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Title */}
      <p className="text-lg text-white/90">Applying effects to your farm...</p>
      {/* Effects Display */}
      <div className="flex justify-center gap-3 flex-wrap">
        {cardEffects.sustainability !== 0 && (
          <div
            className={`bg-gradient-to-br ${"from-pink-700 to-pink-800"} rounded-lg p-3 text-center min-w-[100px]`}
          >
            <div className="text-2xl mb-1">♥️</div>
            <div className="text-xl font-bold text-white">
              {cardEffects.sustainability > 0 ? "+" : ""}
              {Math.round(cardEffects.sustainability * 10) / 10}%
            </div>
            <div className="text-xs text-white/90">Sustain</div>
          </div>
        )}
        {/* {cardEffects.productivityIndex !== 0 && (
          <div
            className={`bg-gradient-to-br ${
              cardEffects.productivityIndex > 0
                ? "from-green-500 to-green-600"
                : "from-red-500 to-red-600"
            } rounded-lg p-3 text-center min-w-[100px]`}
          >
            <div className="text-2xl mb-1">📈</div>
            <div className="text-xl font-bold text-white">
              {cardEffects.productivityIndex > 0 ? "+" : ""}
              {Math.round(cardEffects.productivityIndex * 10) / 10}%
            </div>
            <div className="text-xs text-white/90">Health</div>
          </div>
        )} */}
        {cardEffects.soilMoisture !== 0 && (
          <div
            className={`bg-gradient-to-br ${"from-cyan-500 to-cyan-600"} rounded-lg p-3 text-center min-w-[100px]`}
          >
            <div className="text-2xl mb-1">💧</div>
            <div className="text-xl font-bold text-white">
              {cardEffects.soilMoisture > 0 ? "+" : ""}
              {Math.round(cardEffects.soilMoisture * 10) / 10}%
            </div>
            <div className="text-xs text-white/90">Moisture</div>
          </div>
        )}
        {cardEffects.soilPH !== 0 && (
          <div
            className={`bg-gradient-to-br ${"from-purple-500 to-purple-600"} rounded-lg p-3 text-center min-w-[100px]`}
          >
            <div className="text-2xl mb-1">🧪</div>
            <div className="text-xl font-bold text-white">
              {cardEffects.soilPH > 0 ? "+" : ""}
              {Math.round(cardEffects.soilPH * 100) / 100}
            </div>
            <div className="text-xs text-white/90">pH</div>
          </div>
        )}
        {cropHealthChange !== 0 && (
          <div
            className={`bg-gradient-to-br ${"from-green-500 to-green-600"} rounded-lg p-3 text-center min-w-[100px]`}
          >
            <div className="text-2xl mb-1">🌱</div>
            <div className="text-xl font-bold text-white">
              {cropHealthChange > 0 ? "+" : ""}
              {cropHealthChange}
            </div>
            <div className="text-xs text-white/90">Crop Health</div>
          </div>
        )}
      </div>

      {/* Penalties Display */}
      {/* {penalties.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-300 mb-3 flex items-center justify-center gap-2">
            ⚠️ Penalties Applied
          </h3>
          <div className="space-y-2 max-w-md mx-auto">
            {penalties.map((penalty, index) => (
              <div
                key={index}
                className="bg-red-900/70 border border-red-500 rounded-lg p-3 text-sm text-red-200 animate-pulse"
              >
                <div className="font-bold text-red-100 mb-1">
                  {penalty.title}
                </div>
                <div className="text-red-200">{penalty.description}</div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Continue Button */}
      <button
        onClick={onEffectsComplete}
        className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
      >
        Continue →
      </button>
    </div>
  );
};

export default ScenarioProblemDisplay;
