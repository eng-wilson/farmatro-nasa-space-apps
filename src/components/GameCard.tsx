import React, { useState } from "react";
import { Card } from "@/data/cards";

interface GameCardProps {
  card: Card;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export default function GameCard({
  card,
  isSelected,
  onSelect,
  disabled = false,
}: GameCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getCardBorderColor = () => {
    switch (card.type) {
      case "nasa_data":
        return "border-blue-500";
      case "action":
        return "border-green-500";
      case "multiplier":
        return "border-yellow-500";
      case "emergency":
        return "border-red-500";
      default:
        return "border-gray-300";
    }
  };

  const getCardGlowColor = () => {
    switch (card.type) {
      case "nasa_data":
        return "shadow-blue-400";
      case "action":
        return "shadow-green-400";
      case "multiplier":
        return "shadow-yellow-400";
      case "emergency":
        return "shadow-red-400";
      default:
        return "shadow-gray-400";
    }
  };

  const getCardBgGradient = () => {
    switch (card.type) {
      case "nasa_data":
        return "from-blue-50 to-white";
      case "action":
        return "from-green-50 to-white";
      case "multiplier":
        return "from-yellow-50 to-white";
      case "emergency":
        return "from-red-50 to-white";
      default:
        return "from-gray-50 to-white";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onSelect}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`relative bg-gradient-to-b ${getCardBgGradient()} rounded-lg shadow-xl transition-all duration-300 w-[120px] h-[170px] border-2  ${
          isSelected
            ? `transform -translate-y-4 scale-105 ${getCardGlowColor()} shadow-2xl ring-4 ring-yellow-400`
            : disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:transform hover:-translate-y-3 hover:scale-105 hover:shadow-2xl"
        }`}
      >
        {/* Card Type Badge */}
        {/* <div
          className={`absolute top-1 left-1 text-[8px] font-bold px-2 py-0.5 rounded ${
            card.type === "nasa_data"
              ? "bg-blue-500 text-white"
              : card.type === "action"
              ? "bg-green-500 text-white"
              : card.type === "multiplier"
              ? "bg-yellow-500 text-black"
              : "bg-red-500 text-white"
          }`}
        >
          {card.type === "nasa_data"
            ? "DATA"
            : card.type === "action"
            ? "ACTION"
            : card.type === "multiplier"
            ? "BONUS"
            : "EMERGENCY"}
        </div> */}

        {/* Card Content */}
        <div className="flex flex-col items-center justify-around h-full p-2 ">
          {/* Icon */}

          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl mb-1">{card.icon}</div>

            {/* Card Name */}
            <div className="text-[14px] font-bold text-gray-900 text-center ">
              {card.name}
            </div>
          </div>

          {/* Quick Effects */}
          {/* <div className="text-[9px] text-gray-600 text-center line-clamp-2">
            {card.description}
          </div> */}
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[14px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
            ✓
          </div>
        )}
      </button>

      {/* Detailed Tooltip */}
      {showTooltip && (
        <div
          className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-72 bg-white rounded-lg shadow-2xl border-2 ${getCardBorderColor()} p-4 pointer-events-none`}
        >
          {/* Card Name */}
          <h3 className="font-bold text-lg mb-2 text-gray-900">{card.name}</h3>

          {/* Type */}
          {/* <div className="mb-3">
            <span
              className={`text-[14px] font-bold px-2 py-1 rounded ${
                card.type === "nasa_data"
                  ? "bg-blue-100 text-blue-700"
                  : card.type === "action"
                  ? "bg-green-100 text-green-700"
                  : card.type === "multiplier"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {card.type.toUpperCase().replace("_", " ")}
            </span>
          </div> */}

          {/* Description */}
          <p className="text-sm text-gray-700 mb-3">{card.description}</p>

          {/* NASA Info (if applicable) */}
          {/* {card.nasaInfo && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-2 mb-3">
              <p className="text-[14px] font-bold text-blue-900 mb-1">
                🛰️ {card.nasaInfo.satellite}
              </p>
              <p className="text-[14px] text-gray-700 mb-1">
                <strong>Measures:</strong> {card.nasaInfo.measurement}
              </p>
              <p className="text-[14px] text-gray-700 mb-1">
                <strong>Resolution:</strong> {card.nasaInfo.resolution}
              </p>
              <p className="text-[14px] text-gray-700 mb-1">
                <strong>Updates:</strong> {card.nasaInfo.updateFrequency}
              </p>
              <p className="text-[14px] text-gray-500 italic">
                <strong>Limitations:</strong> {card.nasaInfo.limitations}
              </p>
            </div>
          )} */}

          {/* Effects */}
          {(card.effects.sustainability ||
            card.effects.productivityIndex ||
            card.effects.soilMoisture) && (
            <div className="bg-gray-50 rounded p-2 mb-3">
              <p className="text-[14px] font-bold text-gray-900 mb-1">
                Effects:
              </p>
              <div className="space-y-1">
                {card.effects.sustainability && (
                  <p className="text-[14px] text-gray-700">
                    ♥️ Sustainability{" "}
                    <span
                      className={
                        card.effects.sustainability > 0
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {card.effects.sustainability > 0 ? "+" : "-"}
                    </span>
                  </p>
                )}
                {card.effects.productivityIndex && (
                  <p className="text-[14px] text-gray-700">
                    📈 Productivity Index{" "}
                    <span
                      className={
                        card.effects.productivityIndex > 0
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {card.effects.productivityIndex > 0 ? "+" : "-"}
                    </span>
                  </p>
                )}
                {card.effects.soilMoisture && (
                  <p className="text-[14px] text-gray-700">
                    💧 Soil Moisture{" "}
                    <span
                      className={
                        card.effects.soilMoisture > 0
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {card.effects.soilMoisture > 0 ? "+" : "-"}
                    </span>
                  </p>
                )}
                {card.effects.soilPH && (
                  <p className="text-[14px] text-gray-700">
                    🌡️ pH{" "}
                    <span
                      className={
                        card.effects.soilPH > 0
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {card.effects.soilPH > 0 ? "+" : "-"}
                    </span>
                  </p>
                )}
                {card.effects.cropHealth && (
                  <p className="text-[14px] text-gray-700">
                    🌱 Crop Health{" "}
                    <span
                      className={
                        card.effects.cropHealth > 0
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {card.effects.cropHealth > 0 ? "+" : "-"}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Combo Tips */}
          {/* {card.comboTips.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2">
              <p className="text-[14px] font-bold text-yellow-900 mb-1">
                💡 Combo Tips:
              </p>
              {card.comboTips.map((tip, idx) => (
                <p key={idx} className="text-[14px] text-gray-700 mb-1">
                  • {tip}
                </p>
              ))}
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
