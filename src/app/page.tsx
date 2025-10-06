"use client";

import React, { useState, useEffect } from "react";
import IntroScreen from "@/components/IntroScreen";
import PlayingScreen from "@/components/PlayingScreen";
import ResultsScreen from "@/components/ResultsScreen";

import { GamePhase, GameState, CardEffects, Penalty } from "@/types/game";
import { Card } from "@/data/cards";
import { useAgriculturalData } from "@/hooks/useAgriculturalData";
import {
  initializeGame,
  drawCards,
  calculateCardEffects,
  applyEffects,
  checkLoseCondition,
  checkWinCondition,
  calculateUpdatedMetrics,
  loadScenarioForRound,
  applyScenarioAutoEffects,
  evaluatePlayerSolution,
  applyRecurrentPenalties,
  clearResolvedPenalties,
  getDiscardLimit,
} from "@/utils/gameLogic";

const INITIAL_GAME_STATE: Omit<
  GameState,
  | "hand"
  | "deck"
  | "discardPile"
  | "playedCards"
  | "cardsUsedCount"
  | "currentScenario"
  | "roundOutcomes"
  | "activePenalties"
  | "lastCardPlayed"
  | "discardsUsedThisRound"
  | "consecutiveDefensiveCards"
  | "loseReason"
  | "loseDetails"
> = {
  round: 1,
  week: 1,
  sustainability: 100,
  productivityIndex: 60,
  soilMoisture: 45,
  soilPH: 3.2,
  temperature: 28,
  rainfall: 0,
  cropHealth: 0.2,
};

export default function NASAFarmNavigator() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [showingEffects, setShowingEffects] = useState(false);
  const [currentEffects, setCurrentEffects] = useState<CardEffects | null>(
    null
  );
  const [currentPenalties, setCurrentPenalties] = useState<Penalty[]>([]);

  // Agricultural data from NASA APIs
  const {
    data: agriculturalData,
    setLocation,
    refreshData,
    isLoading,
    hasError,
  } = useAgriculturalData();

  const startGame = () => {
    const { deck, hand } = initializeGame();
    const scenario = loadScenarioForRound(1);

    // Use real NASA data if available, otherwise fall back to defaults
    const initialMetrics = {
      soilMoisture: agriculturalData.soilMoisture,
      temperature: agriculturalData.temperature,
      rainfall: agriculturalData.rainfall,
      cropHealth: Number(agriculturalData.cropHealth.toFixed(2)),
    };

    setGameState({
      ...INITIAL_GAME_STATE,
      ...initialMetrics,
      hand,
      deck,
      discardPile: [],
      playedCards: [],
      cardsUsedCount: {},
      currentScenario: scenario,
      roundOutcomes: [],
      activePenalties: [],
      discardsUsedThisRound: 0,
      consecutiveDefensiveCards: 0,
    });
    // Clear any previous effects display
    setShowingEffects(false);
    setCurrentEffects(null);
    setCurrentPenalties([]);
    setSelectedCards([]);
    setPhase("playing");
  };

  // Load scenario when round changes
  useEffect(() => {
    if (gameState && phase === "playing") {
      const scenario = loadScenarioForRound(gameState.round);
      if (scenario && scenario.round !== gameState.currentScenario?.round) {
        setGameState({
          ...gameState,
          currentScenario: scenario,
        });
        // Clear effects display when new round starts
        setShowingEffects(false);
        setCurrentEffects(null);
        setCurrentPenalties([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.round, phase]);

  const handleSelectCard = (card: Card) => {
    setSelectedCards((prev) => {
      // Use instanceId to identify the specific card instance
      const cardIdentifier = card.instanceId || card.id;
      const isSelected = prev.some(
        (c) => (c.instanceId || c.id) === cardIdentifier
      );
      if (isSelected) {
        return prev.filter((c) => (c.instanceId || c.id) !== cardIdentifier);
      } else {
        if (prev.length >= 2) return prev; // Limit to 2 cards
        return [...prev, card];
      }
    });
  };

  const handleDiscardCards = () => {
    if (!gameState || selectedCards.length === 0) return;

    // Check if player has reached discard limit
    const discardLimit = getDiscardLimit(gameState.sustainability);
    if (gameState.discardsUsedThisRound >= discardLimit) {
      return; // Don't allow more discards
    }

    const newHand = gameState.hand.filter(
      (card) =>
        !selectedCards.some(
          (sc) => (sc.instanceId || sc.id) === (card.instanceId || card.id)
        )
    );
    const newDiscardPile = [...gameState.discardPile, ...selectedCards];

    const { hand: refilledHand, deck: newDeck } = drawCards(
      newHand,
      gameState.deck,
      newDiscardPile
    );

    setGameState({
      ...gameState,
      hand: refilledHand,
      deck: newDeck,
      discardPile: newDiscardPile,
      discardsUsedThisRound: gameState.discardsUsedThisRound + 1,
    });

    setSelectedCards([]);
  };

  const handlePlayCards = () => {
    if (!gameState || selectedCards.length === 0) return;

    // Calculate card effects with penalty system
    const { effects, penalties } = calculateCardEffects(
      selectedCards,
      gameState
    );

    const newCardsUsedCount = { ...gameState.cardsUsedCount };
    selectedCards.forEach((card) => {
      newCardsUsedCount[card.id] = (newCardsUsedCount[card.id] || 0) + 1;
    });

    setCurrentEffects(effects);
    setCurrentPenalties(penalties);
    setShowingEffects(true);

    const newPlayedCards = [
      ...gameState.playedCards,
      {
        round: gameState.round,
        cards: selectedCards,
        effects,
      },
    ];

    const newHand = gameState.hand.filter(
      (card) =>
        !selectedCards.some(
          (sc) => (sc.instanceId || sc.id) === (card.instanceId || card.id)
        )
    );
    const newDiscardPile = [...gameState.discardPile, ...selectedCards];

    // Evaluate solution if there's a scenario
    const newOutcomes = [...gameState.roundOutcomes];
    if (gameState.currentScenario) {
      const outcome = evaluatePlayerSolution(
        gameState.currentScenario,
        selectedCards,
        effects
      );
      newOutcomes.push(outcome);
    }

    setGameState({
      ...gameState,
      hand: newHand,
      discardPile: newDiscardPile,
      playedCards: newPlayedCards,
      cardsUsedCount: newCardsUsedCount,
      roundOutcomes: newOutcomes,
    });
  };

  const handleEffectsComplete = () => {
    if (!gameState || !currentEffects) return;

    // Apply card effects with penalties
    let updatedState = applyEffects(
      gameState,
      currentEffects,
      currentPenalties,
      selectedCards[selectedCards.length - 1]
    );

    // Draw cards to refill hand
    const { hand: newHand, deck: newDeck } = drawCards(
      updatedState.hand,
      updatedState.deck,
      updatedState.discardPile
    );

    updatedState = {
      ...updatedState,
      hand: newHand,
      deck: newDeck,
    };

    // Move to next round
    const newRound = updatedState.round + 1;
    const newWeek = newRound;

    // Load next scenario
    const nextScenario = loadScenarioForRound(newRound);

    // Apply scenario auto-effects (weather events, etc.)
    if (nextScenario) {
      updatedState = applyScenarioAutoEffects(updatedState, nextScenario);
    }

    // Apply recurrent penalties at the end of each round
    updatedState = applyRecurrentPenalties(updatedState);

    // Clear resolved penalties
    updatedState = clearResolvedPenalties(updatedState);

    // Natural moisture decline if no scenario effects
    if (!nextScenario?.autoEffects?.soilMoisture) {
      const moistureDecrease = 5;
      updatedState.soilMoisture = Math.max(
        0,
        updatedState.soilMoisture - moistureDecrease
      );
    }

    // Recalculate crop health using centralized calculation
    const updatedMetrics = calculateUpdatedMetrics(
      updatedState,
      currentEffects
    );
    updatedState.cropHealth = updatedMetrics.updatedCropHealth;

    setGameState({
      ...updatedState,
      round: newRound,
      week: newWeek,
      currentScenario: nextScenario,
      discardsUsedThisRound: 0, // Reset discard count for new round
    });

    setShowingEffects(false);
    setCurrentEffects(null);
    setCurrentPenalties([]);
    setSelectedCards([]);

    // Check win/lose conditions
    const finalState = { ...updatedState, round: newRound };
    if (checkWinCondition(finalState)) {
      setPhase("results");
    } else {
      const loseResult = checkLoseCondition(finalState);
      if (loseResult.lost) {
        // Set the lose reason in the game state
        setGameState((prevState) =>
          prevState
            ? {
                ...prevState,
                loseReason: loseResult.reason,
                loseDetails: loseResult.details,
              }
            : null
        );
        setPhase("results");
      }
    }
  };

  const restartGame = () => {
    setPhase("intro");
    setGameState(null);
    setSelectedCards([]);
    setShowingEffects(false);
    setCurrentEffects(null);
    setCurrentPenalties([]);
  };

  return (
    <div className="h-screen overflow-hidden items-center justify-center flex flex-col bg-black">
      {phase === "intro" && (
        <IntroScreen
          onStart={startGame}
          initialValues={agriculturalData}
          isLoading={isLoading}
        />
      )}
      {phase === "playing" && gameState && (
        <PlayingScreen
          gameState={gameState}
          cardEffects={currentEffects}
          selectedCards={selectedCards}
          onSelectCard={handleSelectCard}
          onPlayCards={handlePlayCards}
          onDiscardCards={handleDiscardCards}
          onEffectsComplete={handleEffectsComplete}
          showingEffects={showingEffects}
          penalties={currentPenalties}
        />
      )}
      {phase === "results" && gameState && (
        <ResultsScreen gameState={gameState} onRestart={restartGame} />
      )}

      {/* AI Generation Acknowledgment */}
      <div className="absolute bottom-2 left-2 z-50 pointer-events-none">
        <div className=" backdrop-blur-sm rounded-lg px-3 py-2">
          <span className="text-white text-xs font-medium">
            AI-Generated Content
          </span>
        </div>
      </div>
    </div>
  );
}
