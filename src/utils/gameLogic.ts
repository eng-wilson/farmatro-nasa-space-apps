import { GameState, CardEffects, RoundOutcome, Penalty } from "@/types/game";
import { Card, shuffleDeck, createDeck } from "@/data/cards";
import { getScenarioForRound, RoundScenario } from "@/data/scenarios";

// Define defensive cards (disease protection, pest management, weed control)
const DEFENSIVE_CARD_IDS = [
  // Disease protection
  "preventive_fungicide",
  "biocontrol_disease",
  // Pest management
  "biocontrol",
  "targeted_spray",
  // Weed control
  "manual_weeding",
  "spot_herbicide",
  "broadcast_herbicide",
];

// Helper function to check if a card is defensive
const isDefensiveCard = (card: Card): boolean => {
  return DEFENSIVE_CARD_IDS.includes(card.id);
};

// Calculate discard limit based on sustainability
export const getDiscardLimit = (sustainability: number): number => {
  if (sustainability > 75) return 4;
  if (sustainability >= 50) return 3;
  if (sustainability >= 25) return 2;
  return 1;
};

export const calculateCropHealth = (
  health: number,
  moisture: number,
  directCropHealth?: number
): number => {
  // Base crop health calculation from health and moisture (0.2 to 0.9 range)
  const baseCropHealth = 0.2 + (health / 100) * (moisture / 100) * 0.7;

  // If there's a direct crop health effect from cards, apply it
  if (directCropHealth !== undefined) {
    const combinedCropHealth = baseCropHealth + directCropHealth;
    return Math.min(Math.max(combinedCropHealth, -1), 1);
  }

  return Math.min(Math.max(baseCropHealth, -1), 1);
};

// Centralized function to calculate updated metrics with consistent precision
export const calculateUpdatedMetrics = (
  gameState: GameState,
  cardEffects: CardEffects
): {
  updatedProductivityIndex: number;
  updatedSoilMoisture: number;
  updatedSoilPH: number;
  updatedCropHealth: number;
} => {
  const updatedProductivityIndex =
    Math.round(
      Math.min(
        100,
        Math.max(
          0,
          gameState.productivityIndex + (cardEffects.productivityIndex || 0)
        )
      ) * 10
    ) / 10;

  const updatedSoilMoisture =
    Math.round(
      Math.min(
        100,
        Math.max(0, gameState.soilMoisture + (cardEffects.soilMoisture || 0))
      ) * 10
    ) / 10;

  const updatedSoilPH =
    Math.round(
      Math.min(14, Math.max(0, gameState.soilPH + (cardEffects.soilPH || 0))) *
        100
    ) / 100;

  const updatedCropHealth = calculateCropHealth(
    updatedProductivityIndex,
    updatedSoilMoisture,
    cardEffects.cropHealth
  );

  return {
    updatedProductivityIndex,
    updatedSoilMoisture,
    updatedSoilPH,
    updatedCropHealth,
  };
};

// Calculate the actual crop health change (difference between current and updated)
export const calculateCropHealthChange = (
  gameState: GameState,
  cardEffects: CardEffects
): number => {
  const currentCropHealth = gameState.cropHealth;
  const updatedMetrics = calculateUpdatedMetrics(gameState, cardEffects);
  const cropHealthChange = updatedMetrics.updatedCropHealth - currentCropHealth;
  return Math.round(cropHealthChange * 100) / 100;
};

export const getMoistureStatus = (moisture: number) => {
  if (moisture < 30)
    return {
      color: "bg-red-500",
      text: "Dry - Crops Stressed",
      textColor: "text-red-600",
    };
  if (moisture <= 60)
    return {
      color: "bg-green-500",
      text: "Optimal Range",
      textColor: "text-green-600",
    };
  return {
    color: "bg-blue-500",
    text: "Wet - Risk of Runoff",
    textColor: "text-blue-600",
  };
};

export const getCropHealthStatus = (cropHealth: number) => {
  if (cropHealth > 0.7)
    return { text: "Excellent Health", textColor: "text-green-600" };
  if (cropHealth >= 0.5)
    return { text: "Good Growth", textColor: "text-yellow-600" };
  if (cropHealth >= 0.3)
    return { text: "Moderate Health", textColor: "text-orange-600" };
  if (cropHealth >= 0.1)
    return { text: "Poor Health", textColor: "text-red-600" };
  if (cropHealth >= -0.1)
    return { text: "Very Poor", textColor: "text-red-700" };
  return { text: "Critical - No Vegetation", textColor: "text-red-800" };
};

export const calculateResults = (gameState: GameState) => {
  // Calculate yield based on final stats (kg/ha)
  const yieldPercentage =
    (gameState.productivityIndex / 100) *
    (Math.min(gameState.sustainability, 100) / 100);
  const finalYield = Math.round(10000 * yieldPercentage); // Max 10,000 kg/ha

  let grade = "D";
  let gradeColor = "text-red-600";
  let gradeMessage = "Farm Crisis - Major losses and environmental damage";

  // New 6-round grading system based on yield, sustainability, and productivity index
  if (
    finalYield > 8500 &&
    gameState.sustainability > 90 &&
    gameState.productivityIndex > 95
  ) {
    grade = "A";
    gradeColor = "text-green-600";
    gradeMessage = "Climate-Smart Master! Perfect data-driven farming";
  } else if (
    finalYield > 7000 &&
    gameState.sustainability > 70 &&
    gameState.productivityIndex > 80
  ) {
    grade = "B";
    gradeColor = "text-blue-600";
    gradeMessage = "Solid Farmer - Good NASA data integration";
  } else if (
    finalYield > 5000 &&
    gameState.sustainability > 50 &&
    gameState.productivityIndex > 60
  ) {
    grade = "C";
    gradeColor = "text-yellow-600";
    gradeMessage = "Struggling Farm - Needs better resource management";
  }

  return { finalYield, grade, gradeColor, gradeMessage };
};

// Initialize a new game with shuffled deck and starting hand
export const initializeGame = (): {
  deck: Card[];
  hand: Card[];
} => {
  const fullDeck = createDeck(3); // Create 3 copies of each card
  const shuffled = shuffleDeck(fullDeck);
  const hand = shuffled.slice(0, 5); // Start with 5 cards
  const deck = shuffled.slice(5);

  return { deck, hand };
};

// Draw cards to refill hand to 5 cards
export const drawCards = (
  currentHand: Card[],
  currentDeck: Card[],
  discardPile: Card[]
): { hand: Card[]; deck: Card[] } => {
  const cardsNeeded = 5 - currentHand.length;
  if (cardsNeeded <= 0) {
    return { hand: currentHand, deck: currentDeck };
  }

  let deck = [...currentDeck];
  let hand = [...currentHand];

  // If deck is empty, reshuffle discard pile
  if (deck.length === 0 && discardPile.length > 0) {
    deck = shuffleDeck(discardPile);
  }

  const drawn = deck.slice(0, cardsNeeded);
  hand = [...hand, ...drawn];
  deck = deck.slice(cardsNeeded);

  return { hand, deck };
};

// Apply penalty system to individual card effects
export const applyCardEffects = (
  card: Card,
  currentState: GameState
): { effects: CardEffects; penalties: Penalty[] } => {
  const effects: CardEffects = {
    sustainability: card.effects.sustainability || 0,
    productivityIndex: card.effects.productivityIndex || 0,
    soilMoisture: card.effects.soilMoisture || 0,
    soilPH: card.effects.soilPH || 0,
    cropHealth: card.effects.cropHealth || 0,
  };
  const penalties: Penalty[] = [];

  // Helper function to check if a penalty type already exists
  const hasPenaltyType = (metric: string, titleKeyword: string) => {
    return currentState.activePenalties.some(
      (penalty) =>
        penalty.metric === metric && penalty.title.includes(titleKeyword)
    );
  };

  // CHECK CONDITIONAL PENALTIES

  // 1. WATERLOGGING CHECK
  if (
    (card.effects.soilMoisture || 0) > 0 &&
    currentState.soilMoisture > 70 &&
    !hasPenaltyType("soilMoisture", "Waterlogging")
  ) {
    effects.productivityIndex -= 25;
    effects.sustainability -= 30;
    effects.cropHealth -= 0.2;
    penalties.push({
      metric: "soilMoisture",
      title: "Waterlogging",
      description:
        "Root oxygen depletion causing severe damage! Excess moisture prevents roots from breathing properly.",
    });
  }

  // 2. DROUGHT IRRIGATION CHECK
  if (
    (card.effects.soilMoisture || 0) > 0 &&
    currentState.soilMoisture < 30 &&
    !hasPenaltyType("soilMoisture", "Inefficient")
  ) {
    effects.sustainability -= 15;
    penalties.push({
      metric: "soilMoisture",
      title: "Inefficient Irrigation",
      description:
        "Dry soil absorbs poorly, causing 40% runoff! Water is wasted instead of reaching plant roots.",
    });
  }

  // 3. pH OVERCORRECTION CHECK
  if (
    (card.effects.soilPH || 0) > 0 &&
    currentState.soilPH > 7 &&
    !hasPenaltyType("soilPH", "Alkaline")
  ) {
    effects.productivityIndex -= 20;
    penalties.push({
      metric: "soilPH",
      title: "Alkaline Lockout",
      description:
        "Iron and zinc becoming unavailable! High pH prevents essential nutrients from being absorbed.",
    });
  }

  if (
    (card.effects.soilPH || 0) < 0 &&
    currentState.soilPH < 6 &&
    !hasPenaltyType("soilPH", "Acid")
  ) {
    effects.productivityIndex -= 25;
    penalties.push({
      metric: "soilPH",
      title: "Acid Toxicity",
      description:
        "Aluminum poisoning roots! Low pH releases toxic aluminum that damages plant roots.",
    });
  }

  // 4. CONSECUTIVE DEFENSIVE CARDS CHECK
  if (isDefensiveCard(card)) {
    // Check if last card played was also defensive
    if (
      currentState.lastCardPlayed &&
      isDefensiveCard(currentState.lastCardPlayed)
    ) {
      effects.cropHealth -= 0.15; // Extra crop health loss for using 2 defensive cards in sequence
      penalties.push({
        metric: "cropHealth",
        title: "Phytotoxicity",
        description:
          "Excessive defensive measures stress crops! Using too many protective treatments in sequence reduces plant vigor and crop health.",
      });
    }
  }

  return {
    effects,
    penalties,
  };
};

// Calculate total effects from played cards (simplified - no combos)
export const calculateCardEffects = (
  cards: Card[],
  gameState: GameState
): { effects: CardEffects; penalties: Penalty[] } => {
  const totalEffects: CardEffects = {
    sustainability: 0,
    productivityIndex: 0,
    soilMoisture: 0,
    soilPH: 0,
    cropHealth: 0,
  };

  const allPenalties: Penalty[] = [];

  // Check for multiple defensive cards in the same turn
  const defensiveCardsInTurn = cards.filter((card) => isDefensiveCard(card));
  if (defensiveCardsInTurn.length >= 2) {
    // Apply phytotoxicity penalty for each defensive card after the first one
    defensiveCardsInTurn.slice(1).forEach(() => {
      totalEffects.cropHealth -= 0.15;
      allPenalties.push({
        metric: "cropHealth",
        title: "Phytotoxicity",
        description:
          "Excessive defensive measures stress crops! Using too many protective treatments in sequence reduces plant vigor and crop health.",
      });
    });
  }

  // Apply each card with penalty system
  cards.forEach((card) => {
    const { effects, penalties } = applyCardEffects(card, gameState);

    // Check for special events that affect defensive cards
    const modifiedEffects = { ...effects };

    // PLAGUE EVENT: Remove positive effects of defensive cards
    if (
      gameState.currentScenario?.event.type === "plague" &&
      isDefensiveCard(card)
    ) {
      // Remove positive effects, keep only negative ones
      if (
        modifiedEffects.productivityIndex &&
        modifiedEffects.productivityIndex > 0
      ) {
        modifiedEffects.productivityIndex = 0;
      }
      if (modifiedEffects.cropHealth && modifiedEffects.cropHealth > 0) {
        modifiedEffects.cropHealth = 0;
      }
      if (
        modifiedEffects.sustainability &&
        modifiedEffects.sustainability > 0
      ) {
        modifiedEffects.sustainability = 0;
      }
    }

    // WIND EVENT: Remove positive effects of defensive cards
    if (
      gameState.currentScenario?.event.type === "wind" &&
      isDefensiveCard(card)
    ) {
      // Remove positive effects, keep only negative ones
      if (
        modifiedEffects.productivityIndex &&
        modifiedEffects.productivityIndex > 0
      ) {
        modifiedEffects.productivityIndex = 0;
      }
      if (modifiedEffects.cropHealth && modifiedEffects.cropHealth > 0) {
        modifiedEffects.cropHealth = 0;
      }
      if (
        modifiedEffects.sustainability &&
        modifiedEffects.sustainability > 0
      ) {
        modifiedEffects.sustainability = 0;
      }
    }

    totalEffects.sustainability += modifiedEffects.sustainability || 0;
    totalEffects.productivityIndex += modifiedEffects.productivityIndex || 0;
    totalEffects.soilMoisture += modifiedEffects.soilMoisture || 0;
    totalEffects.soilPH += modifiedEffects.soilPH || 0;
    totalEffects.cropHealth += modifiedEffects.cropHealth || 0;

    allPenalties.push(...penalties);
  });

  return { effects: totalEffects, penalties: allPenalties };
};

// Apply effects to game state
export const applyEffects = (
  gameState: GameState,
  effects: CardEffects,
  penalties: Penalty[] = [],
  lastCardPlayed?: Card
): GameState => {
  const newSustainability = Math.min(
    100,
    Math.max(0, gameState.sustainability + effects.sustainability)
  );
  const newProductivityIndex = Math.min(
    100,
    Math.max(0, gameState.productivityIndex + effects.productivityIndex)
  );
  const newSoilMoisture = Math.min(
    100,
    Math.max(0, gameState.soilMoisture + effects.soilMoisture)
  );
  const newSoilPH = Math.min(
    14,
    Math.max(0, gameState.soilPH + effects.soilPH)
  );
  const newCropHealth = calculateCropHealth(
    newProductivityIndex,
    newSoilMoisture,
    effects.cropHealth
  );

  // Add new penalties to existing ones
  const updatedPenalties = [...gameState.activePenalties, ...penalties];

  // Update consecutive defensive cards tracking
  let newConsecutiveDefensiveCards = gameState.consecutiveDefensiveCards;
  if (lastCardPlayed) {
    if (isDefensiveCard(lastCardPlayed)) {
      newConsecutiveDefensiveCards = gameState.consecutiveDefensiveCards + 1;
    } else {
      newConsecutiveDefensiveCards = 0; // Reset counter for non-defensive cards
    }
  }

  return {
    ...gameState,
    sustainability: Math.round(newSustainability * 10) / 10,
    productivityIndex: Math.round(newProductivityIndex * 10) / 10,
    soilMoisture: Math.round(newSoilMoisture * 10) / 10,
    soilPH: Math.round(newSoilPH * 100) / 100,
    cropHealth: Math.round(newCropHealth * 100) / 100,
    activePenalties: updatedPenalties,
    lastCardPlayed: lastCardPlayed || gameState.lastCardPlayed,
    consecutiveDefensiveCards: newConsecutiveDefensiveCards,
  };
};

// Check if player has lost and return the reason
export const checkLoseCondition = (
  gameState: GameState
): { lost: boolean; reason?: string; details?: string } => {
  // if (gameState.productivityIndex <= 0) {
  //   return {
  //     lost: true,
  //     reason: "Productivity Index Critical",
  //     details: `Your productivity index dropped to ${gameState.productivityIndex.toFixed(
  //       1
  //     )}%. Crops need at least 1% productivity to survive. Poor soil conditions, disease, or inadequate care caused your crops to fail.`,
  //   };
  // }

  if (gameState.sustainability <= 0) {
    return {
      lost: true,
      reason: "Sustainability Collapse",
      details: `Your sustainability dropped to ${gameState.sustainability.toFixed(
        1
      )}%. Environmental damage from excessive chemical use, water waste, or soil degradation has made your farm unsustainable.`,
    };
  }

  return { lost: false };
};

// Check if player has won (completed all 12 rounds)
export const checkWinCondition = (gameState: GameState): boolean => {
  return gameState.round > 12;
};

// Apply recurrent penalties at the end of each round
export const applyRecurrentPenalties = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  const newPenalties: Penalty[] = [];

  // Helper function to check if a penalty type already exists
  const hasPenaltyType = (metric: string, titleKeyword: string) => {
    return gameState.activePenalties.some(
      (penalty) =>
        penalty.metric === metric && penalty.title.includes(titleKeyword)
    );
  };

  // Apply penalty effects EVERY turn when conditions are met, regardless of whether penalty already exists

  // 1. WATERLOGGING - Apply damage every turn if moisture > 70%
  if (gameState.soilMoisture > 70) {
    newState.productivityIndex = Math.max(0, newState.productivityIndex - 5);
    newState.sustainability = Math.max(0, newState.sustainability - 8);

    // Only add penalty badge if it doesn't already exist
    if (!hasPenaltyType("soilMoisture", "Waterlogging")) {
      newPenalties.push({
        metric: "soilMoisture",
        title: "Recurrent Waterlogging",
        description:
          "Continued root damage from excess moisture! Plants are suffocating from lack of oxygen.",
      });
    }
  }

  // 2. DROUGHT - Apply damage every turn if moisture < 30%
  if (gameState.soilMoisture < 30) {
    newState.productivityIndex = Math.max(0, newState.productivityIndex - 3);
    newState.sustainability = Math.max(0, newState.sustainability - 5);

    // Only add penalty badge if it doesn't already exist
    if (!hasPenaltyType("soilMoisture", "Drought")) {
      newPenalties.push({
        metric: "soilMoisture",
        title: "Recurrent Drought",
        description:
          "Crops stressed from insufficient water! Plants are wilting and growth is stunted.",
      });
    }
  }

  // 3. ALKALINE - Apply damage every turn if pH > 7
  if (gameState.soilPH > 7) {
    newState.productivityIndex = Math.max(0, newState.productivityIndex - 4);

    // Only add penalty badge if it doesn't already exist
    if (!hasPenaltyType("soilPH", "Alkaline")) {
      newPenalties.push({
        metric: "soilPH",
        title: "Recurrent Alkaline",
        description:
          "Nutrient lockout continues! Essential minerals remain unavailable to plants.",
      });
    }
  }

  // 4. ACIDITY - Apply damage every turn if pH < 6
  if (gameState.soilPH < 6) {
    newState.productivityIndex = Math.max(0, newState.productivityIndex - 6);

    // Only add penalty badge if it doesn't already exist
    if (!hasPenaltyType("soilPH", "Acid")) {
      newPenalties.push({
        metric: "soilPH",
        title: "Recurrent Acidity",
        description:
          "Aluminum toxicity persists! Toxic metals continue to damage root systems.",
      });
    }
  }

  // 5. CROP HEALTH - Apply damage every turn if crop health < 0.3
  if (gameState.cropHealth < 0.3) {
    newState.productivityIndex = Math.max(0, newState.productivityIndex - 8);
    newState.sustainability = Math.max(0, newState.sustainability - 10);

    // Only add penalty badge if it doesn't already exist
    if (!hasPenaltyType("cropHealth", "Poor Health")) {
      newPenalties.push({
        metric: "cropHealth",
        title: "Recurrent Poor Health",
        description:
          "Crops are struggling! Low crop health reduces productivity and sustainability.",
      });
    }
  }

  // 6. TEMPERATURE - Apply damage every turn if temperature is outside ideal range
  if (gameState.temperature < 15 || gameState.temperature > 30) {
    newState.productivityIndex = Math.max(0, newState.productivityIndex - 4);
    newState.sustainability = Math.max(0, newState.sustainability - 6);

    // Only add penalty badge if it doesn't already exist
    if (!hasPenaltyType("temperature", "Temperature Stress")) {
      newPenalties.push({
        metric: "temperature",
        title: "Recurrent Temperature Stress",
        description:
          "Extreme temperatures stress crops! Outside the ideal 15-30°C range, plants struggle to grow efficiently.",
      });
    }
  }

  // 7. RAINFALL - Apply damage every turn if rainfall is outside ideal range
  if (gameState.rainfall < 10 || gameState.rainfall > 50) {
    newState.productivityIndex = Math.max(0, newState.productivityIndex - 3);
    newState.sustainability = Math.max(0, newState.sustainability - 5);

    // Only add penalty badge if it doesn't already exist
    if (!hasPenaltyType("rainfall", "Rainfall Imbalance")) {
      newPenalties.push({
        metric: "rainfall",
        title: "Recurrent Rainfall Imbalance",
        description:
          "Inadequate or excessive rainfall! Outside the ideal 10-50mm range, water management becomes challenging.",
      });
    }
  }

  // Recalculate crop health after penalty effects
  newState.cropHealth = calculateCropHealth(
    newState.productivityIndex,
    newState.soilMoisture
  );

  // Add new penalties to existing ones
  newState.activePenalties = [...newState.activePenalties, ...newPenalties];

  return newState;
};

// Clear penalties that are no longer applicable
export const clearResolvedPenalties = (gameState: GameState): GameState => {
  const resolvedPenalties = gameState.activePenalties.filter((penalty) => {
    // Clear waterlogging penalties if moisture is back to normal
    if (
      penalty.metric === "soilMoisture" &&
      penalty.title.includes("Waterlogging") &&
      gameState.soilMoisture <= 70
    ) {
      return false;
    }
    // Clear drought penalties if moisture is back to normal
    if (
      penalty.metric === "soilMoisture" &&
      penalty.title.includes("Drought") &&
      gameState.soilMoisture >= 30
    ) {
      return false;
    }
    // Clear pH penalties if pH is back to normal range
    if (
      penalty.metric === "soilPH" &&
      penalty.title.includes("Alkaline") &&
      gameState.soilPH <= 7
    ) {
      return false;
    }
    if (
      penalty.metric === "soilPH" &&
      penalty.title.includes("Acid") &&
      gameState.soilPH >= 6
    ) {
      return false;
    }
    // Clear crop health penalties if health is back to normal
    if (
      penalty.metric === "cropHealth" &&
      penalty.title.includes("Poor Health") &&
      gameState.cropHealth >= 0.3
    ) {
      return false;
    }
    // Clear temperature penalties if temperature is back to normal range
    if (
      penalty.metric === "temperature" &&
      penalty.title.includes("Temperature Stress") &&
      gameState.temperature >= 15 &&
      gameState.temperature <= 30
    ) {
      return false;
    }
    // Clear rainfall penalties if rainfall is back to normal range
    if (
      penalty.metric === "rainfall" &&
      penalty.title.includes("Rainfall Imbalance") &&
      gameState.rainfall >= 10 &&
      gameState.rainfall <= 50
    ) {
      return false;
    }
    // Keep other penalties (like resistance risk) as they don't auto-resolve
    return true;
  });

  return {
    ...gameState,
    activePenalties: resolvedPenalties,
  };
};

// Load scenario for current round
export const loadScenarioForRound = (round: number): RoundScenario | null => {
  return getScenarioForRound(round);
};

// Calculate updated metrics from scenario auto-effects (for display purposes)
export const calculateScenarioAutoEffects = (
  gameState: GameState,
  scenario: RoundScenario
): {
  updatedSoilMoisture?: number;
  updatedTemperature?: number;
  updatedRainfall?: number;
  updatedCropHealth?: number;
  updatedProductivityIndex?: number;
} => {
  if (!scenario.autoEffects) return {};

  const updates: {
    updatedSoilMoisture?: number;
    updatedTemperature?: number;
    updatedRainfall?: number;
    updatedCropHealth?: number;
    updatedProductivityIndex?: number;
  } = {};

  if (scenario.autoEffects.soilMoisture !== undefined) {
    updates.updatedSoilMoisture = Math.min(
      100,
      Math.max(0, gameState.soilMoisture + scenario.autoEffects.soilMoisture)
    );
  }

  if (scenario.autoEffects.temperature !== undefined) {
    updates.updatedTemperature = scenario.autoEffects.temperature;
  }

  if (scenario.autoEffects.rainfall !== undefined) {
    updates.updatedRainfall = scenario.autoEffects.rainfall;
  }

  if (scenario.autoEffects.productivityIndex !== undefined) {
    updates.updatedProductivityIndex = Math.min(
      100,
      Math.max(
        0,
        gameState.productivityIndex + scenario.autoEffects.productivityIndex
      )
    );
  }

  // Calculate updated NDVI if there are any effects
  if (
    scenario.autoEffects.cropHealth !== undefined ||
    scenario.autoEffects.soilMoisture !== undefined
  ) {
    const cropHealthEffect = scenario.autoEffects?.cropHealth || 0;
    const newMoisture = updates.updatedSoilMoisture || gameState.soilMoisture;
    updates.updatedCropHealth = calculateCropHealth(
      gameState.productivityIndex,
      newMoisture,
      cropHealthEffect
    );
  }

  return updates;
};

// Apply scenario auto-effects (weather events, etc.)
export const applyScenarioAutoEffects = (
  gameState: GameState,
  scenario: RoundScenario
): GameState => {
  if (!scenario.autoEffects) return gameState;

  const newState = { ...gameState };

  if (scenario.autoEffects.soilMoisture !== undefined) {
    newState.soilMoisture = Math.min(
      100,
      Math.max(0, newState.soilMoisture + scenario.autoEffects.soilMoisture)
    );
  }

  if (scenario.autoEffects.temperature !== undefined) {
    newState.temperature = scenario.autoEffects.temperature;
  }

  if (scenario.autoEffects.rainfall !== undefined) {
    newState.rainfall = scenario.autoEffects.rainfall;
  }

  if (scenario.autoEffects.productivityIndex !== undefined) {
    newState.productivityIndex = Math.min(
      100,
      Math.max(
        0,
        newState.productivityIndex + scenario.autoEffects.productivityIndex
      )
    );
  }

  // Recalculate crop health (including any direct crop health effects from scenario)
  const cropHealthEffect = scenario.autoEffects?.cropHealth || 0;
  newState.cropHealth = calculateCropHealth(
    newState.productivityIndex,
    newState.soilMoisture,
    cropHealthEffect
  );

  return newState;
};

// Evaluate player's solution for the scenario
export const evaluatePlayerSolution = (
  scenario: RoundScenario,
  playedCards: Card[],
  effects: CardEffects
): RoundOutcome => {
  return {
    round: scenario.round,
    scenarioTitle: scenario.title,
    cardsPlayed: playedCards,
    effects: effects,
  };
};
