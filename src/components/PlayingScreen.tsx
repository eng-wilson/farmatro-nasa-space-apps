import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GameState, CardEffects, Penalty } from "@/types/game";
import { Card } from "@/data/cards";
import { SCENARIOS } from "@/data/scenarios";
import GameCard from "./GameCard";
import MetricsDisplay from "./MetricsDisplay";
import ScenarioProblemDisplay from "./ScenarioProblemDisplay";
import MetricCard from "./MetricCard";
import {
  calculateUpdatedMetrics,
  calculateScenarioAutoEffects,
  getDiscardLimit,
} from "@/utils/gameLogic";

interface PlayingScreenProps {
  gameState: GameState;
  cardEffects: CardEffects | null;
  selectedCards: Card[];
  onSelectCard: (card: Card) => void;
  onPlayCards: () => void;
  onDiscardCards: () => void;
  onEffectsComplete: () => void;
  showingEffects: boolean;
  penalties?: Penalty[];
}

export default function PlayingScreen({
  gameState,
  cardEffects,
  selectedCards,
  onSelectCard,
  onPlayCards,
  onDiscardCards,
  onEffectsComplete,
  showingEffects,
  penalties = [],
}: PlayingScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Trigger fade in animation on mount
    setIsVisible(true);
    setShowIntro(true);
  }, []);

  const handleIntroClose = () => {
    setShowIntro(false);
    // After fade out completes, hide the component
    setTimeout(() => {
      setShouldRender(false);
    }, 1000); // Match the duration-1000 class
  };

  const handlePlayCards = () => {
    setShowIntro(true);
    onPlayCards();
  };

  useEffect(() => {
    setShouldRender(true);
  }, [showIntro]);

  return (
    <div
      className={`w-full h-screen flex flex-col overflow-hidden transition-opacity z-10 duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src="/assets/background-grass.png"
        alt="Background"
        width={5960}
        height={4238}
        className="absolute top-0 left-right w-full h-full"
        style={{ objectFit: "cover", zIndex: 1 }}
      />

      {/* Header */}

      {/* Main Game Area with Metrics Sidebar */}
      <div className="flex-1 flex overflow-hidden pl-[24px] z-10">
        {/* Metrics Sidebar */}
        <div className="relative flex flex-col justify-around w-[300px] ">
          <Image
            src="/assets/side-menu-bg.png"
            alt="Background"
            width={554}
            height={2000}
            className="absolute top-0 left-0 w-[554px] h-full "
            style={{ objectFit: "cover", zIndex: 1 }}
          />
          <div className="z-10  text-white py-2 px-6 flex-shrink-0 p-6 backdrop-blur-sm">
            <div className="mx-auto flex justify-center flex-col items-center gap-4">
              {/* Round Counter */}
              <div className="text-center flex-1">
                <p className="text-lg font-bold whitespace-nowrap">
                  Round {gameState.round} / {SCENARIOS.length} • Week{" "}
                  {gameState.week}
                </p>
              </div>
              <MetricCard
                icon="♥️"
                label="Sustainability"
                value={gameState.sustainability}
                updatedValue={
                  showingEffects && cardEffects
                    ? Math.min(
                        100,
                        Math.max(
                          0,
                          gameState.sustainability + cardEffects.sustainability
                        )
                      )
                    : undefined
                }
                bgGradient="bg-pink-800"
                iconBg="bg-pink-900"
                explanation="Sustainability measures the long-term health of the soil and the environment. It is a measure of how sustainable the farming practices are."
                showSustainabilityAlert={gameState.activePenalties.length > 0}
                shouldRenderAnimation={showingEffects}
                metricKey="sustainability"
                penalties={gameState.activePenalties}
              />
            </div>
          </div>

          <MetricsDisplay
            soilPH={gameState.soilPH}
            cropHealth={gameState.cropHealth}
            soilMoisture={gameState.soilMoisture}
            temperature={gameState.temperature}
            rainfall={gameState.rainfall}
            shouldRenderAnimation={showIntro}
            updatedSoilPH={
              showingEffects && cardEffects
                ? calculateUpdatedMetrics(gameState, cardEffects).updatedSoilPH
                : undefined
            }
            updatedCropHealth={
              showingEffects && cardEffects
                ? calculateUpdatedMetrics(gameState, cardEffects)
                    .updatedCropHealth
                : gameState.currentScenario
                ? calculateScenarioAutoEffects(
                    gameState,
                    gameState.currentScenario
                  ).updatedCropHealth
                : undefined
            }
            updatedSoilMoisture={
              showingEffects && cardEffects
                ? calculateUpdatedMetrics(gameState, cardEffects)
                    .updatedSoilMoisture
                : gameState.currentScenario
                ? calculateScenarioAutoEffects(
                    gameState,
                    gameState.currentScenario
                  ).updatedSoilMoisture
                : undefined
            }
            updatedTemperature={
              gameState.currentScenario
                ? calculateScenarioAutoEffects(
                    gameState,
                    gameState.currentScenario
                  ).updatedTemperature
                : undefined
            }
            updatedRainfall={
              gameState.currentScenario
                ? calculateScenarioAutoEffects(
                    gameState,
                    gameState.currentScenario
                  ).updatedRainfall
                : undefined
            }
            activePenalties={gameState.activePenalties}
            forceTemperatureAnimation={
              gameState.currentScenario?.autoEffects?.temperature !== undefined
            }
            forceRainfallAnimation={
              gameState.currentScenario?.autoEffects?.rainfall !== undefined
            }
            forceTemperatureDirection={
              gameState.currentScenario?.autoEffects?.temperature !== undefined
                ? gameState.currentScenario.autoEffects.temperature > 30 // Assuming normal temperature is around 28-30°C
                : true
            }
            forceRainfallDirection={
              gameState.currentScenario?.autoEffects?.rainfall !== undefined
                ? gameState.currentScenario.autoEffects.rainfall > 0 // Any rainfall > 0 is an increase
                : true
            }
          />
        </div>

        {/* Main Play Area Column */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* <Image
            src="/assets/field.png"
            alt="Background"
            width={1000}
            height={1000}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "cover", zIndex: -10 }}
          /> */}
          {/* Poker Table Game Area */}
          <div className="flex-1 relative overflow-hidden ">
            {/* Poker table felt texture effect */}
            <div className="absolute inset-0 p-10">
              <Image
                src={`/assets/fields/campo-${
                  gameState.round < 3
                    ? 1
                    : gameState.round < 5
                    ? 2
                    : gameState.round < 7
                    ? 3
                    : gameState.round < 9
                    ? 4
                    : gameState.round < 11
                    ? 5
                    : 6
                }.png`}
                alt="Poker Table"
                width={1000}
                height={1000}
                className="top-0 left-right w-full h-full"
                style={{ objectFit: "cover", zIndex: 1 }}
              />
            </div>

            {/* Corner Field Status Cards */}

            {/* Scenario Alert Banner */}

            {/* Center Play Area */}
            <div
              className={`z-50 max-w-2xl mx-auto absolute inset-0 flex items-center justify-center p-4 ${
                showIntro ? "opacity-100" : "opacity-0"
              } duration-1000`}
            >
              <div className="z-50 max-w-4xl w-full">
                {showingEffects && cardEffects && (
                  /* Effects Display in Center */
                  <>
                    <ScenarioProblemDisplay
                      selectedCards={selectedCards}
                      cardEffects={cardEffects}
                      gameState={gameState}
                      onEffectsComplete={onEffectsComplete}
                      penalties={penalties}
                    />
                  </>
                )}
                {(!showingEffects || !cardEffects) && (
                  /* Scenario Problem Display */

                  <div className="z-30 text-center">
                    {gameState.currentScenario &&
                      gameState.currentScenario.event.type === "none" && (
                        <div className="bg-black/30 rounded-xl p-6 inline-block max-w-3xl w-full mt-10">
                          <h2 className="text-3xl font-bold text-yellow-300 mb-2">
                            {gameState.currentScenario.title}
                          </h2>

                          {gameState.currentScenario.round === 1 && (
                            <div className="text-white/80 space-y-1 text-[18px] flex gap-2">
                              <div className="flex flex-col items-center gap-2 flex-1">
                                <p className="text-[32px]">🎯</p>
                                <p> Use NASA data to diagnose the problem</p>
                              </div>
                              <div className="flex flex-col items-center gap-2 flex-1">
                                <p className="text-[32px]">🌾</p>
                                <p> Play up to 2 cards per round</p>
                              </div>
                              <div className="flex flex-col items-center gap-2 flex-1">
                                <p className="text-[32px]">💡</p>
                                <p> Choose your actions wisely!</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    {gameState.currentScenario &&
                      gameState.currentScenario.event.type !== "none" && (
                        <div className="z-50 mt-10  max-w-2xl w-full px-4">
                          <div
                            className={`rounded-lg p-4 shadow-2xl border-2 backdrop-blur-sm ${
                              gameState.currentScenario.event.type === "rain"
                                ? "bg-blue-900/90 border-blue-400"
                                : gameState.currentScenario.event.type ===
                                  "heatwave"
                                ? "bg-red-900/90 border-red-400"
                                : gameState.currentScenario.event.type ===
                                  "pests"
                                ? "bg-yellow-900/90 border-yellow-400"
                                : "bg-green-900/90 border-green-400"
                            }`}
                          >
                            <p className="text-white text-center font-bold text-[24px]">
                              {gameState.currentScenario.event.icon}{" "}
                              {gameState.currentScenario.event.alert}
                            </p>
                          </div>
                        </div>
                      )}

                    {shouldRender && (
                      <button
                        onClick={handleIntroClose}
                        className="mt-10 bg-[#fdc803] z-10 text-[#653200] text-2xl font-bold py-4 px-6 rounded-[24px] hover:scale-105 transition-all transform border-6 border-[#653200] hover:brightness-105 duration-300 cursor-pointer"
                      >
                        Got it
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {shouldRender && (
              <Image
                src="/assets/4.png"
                alt="Farm Table"
                width={300}
                height={100}
                className={`absolute bottom-0 -right-[50px] z-50 ${
                  showIntro ? "opacity-100" : "opacity-0"
                } duration-500`}
                style={{ objectFit: "contain" }}
              />
            )}
          </div>

          {/* Card Hand with Action Buttons */}
          <div
            className={`w-full bg-[#FFD589] shadow-2xl flex-shrink-0  rounded-t-[16px] ${
              !showIntro
                ? "pointer-events-auto"
                : "pointer-events-none opacity-50"
            } duration-500`}
          >
            <div className="w-full h-full mx-auto px-4 py-3 flex items-centerjustify-center gap-4 ">
              {/* Discard Button - Right */}
              <button
                onClick={onDiscardCards}
                disabled={
                  selectedCards?.length === 0 ||
                  gameState.discardsUsedThisRound >=
                    getDiscardLimit(gameState.sustainability)
                }
                className={`w-[160px] justify-center h-full flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-white transition-all transform whitespace-nowrap ${
                  selectedCards?.length === 0 ||
                  gameState.discardsUsedThisRound >=
                    getDiscardLimit(gameState.sustainability)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 hover:scale-105 shadow-lg"
                }`}
              >
                {/* <Trash2 size={16} /> */}
                <span
                  className={`${
                    selectedCards?.length === 0 ||
                    gameState.discardsUsedThisRound >=
                      getDiscardLimit(gameState.sustainability)
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  Discard - {gameState.discardsUsedThisRound}/
                  {getDiscardLimit(gameState.sustainability)}
                </span>
              </button>

              {/* Cards Display - Center */}
              <div
                className={`relative flex justify-center items-center h-48 w-full bottom-[24px] pt-6 ${
                  !showIntro ? "opacity-100" : "opacity-0"
                } duration-500`}
              >
                {gameState.hand.map((card, index) => {
                  const cardIdentifier = card.instanceId || card.id;
                  const isSelected = selectedCards.some(
                    (c) => (c.instanceId || c.id) === cardIdentifier
                  );
                  const isDisabled = selectedCards.length >= 2 && !isSelected;

                  // Calculate fan arc positioning
                  const totalCards = gameState.hand.length;
                  const centerIndex = (totalCards - 1) / 2;
                  const offset = index - centerIndex;

                  // Base rotation angle (very minimal spread from -1° to +1°)
                  const baseRotation =
                    offset * (2 / Math.max(totalCards - 1, 1));
                  // Add subtle random variation (-0.3° to +0.3°)
                  const randomVariation =
                    Math.sin(index * 12.9898 + card.id.length) * 0.6 - 0.3;
                  const rotation = baseRotation + randomVariation;

                  // Horizontal positioning (much wider spacing for minimal overlap)
                  const horizontalSpread = offset * 110;

                  // Vertical positioning (create arc shape)
                  const verticalOffset = Math.abs(offset) * 5;

                  return (
                    <div
                      key={cardIdentifier}
                      className="absolute transition-all duration-300"
                      style={{
                        transform: `
                          translateX(${horizontalSpread}px)
                          translateY(${isSelected ? -20 : verticalOffset}px)
                          rotate(${isSelected ? 0 : rotation}deg)
                          ${isSelected ? "scale(1.1)" : "scale(1)"}
                        `,
                        zIndex: isSelected ? 100 : 50 + index,
                      }}
                    >
                      <GameCard
                        card={card}
                        isSelected={isSelected}
                        onSelect={() => onSelectCard(card)}
                        disabled={isDisabled}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Play Cards Button - Left */}
              <button
                onClick={handlePlayCards}
                disabled={selectedCards?.length === 0}
                className={`w-[160px] justify-center h-full px-6 py-3 rounded-lg font-bold text-white transition-all transform whitespace-nowrap ${
                  selectedCards?.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 hover:scale-105 shadow-lg"
                }`}
              >
                <span
                  className={`${
                    selectedCards?.length === 0 ? "opacity-50" : ""
                  }`}
                >
                  Play Cards ({selectedCards?.length})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
