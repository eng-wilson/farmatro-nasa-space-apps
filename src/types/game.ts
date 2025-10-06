import { Card } from "@/data/cards";
import { RoundScenario } from "@/data/scenarios";

export type GamePhase = "intro" | "playing" | "results";

export interface Penalty {
  metric:
    | "soilMoisture"
    | "soilPH"
    | "productivityIndex"
    | "sustainability"
    | "cropHealth"
    | "temperature"
    | "rainfall";
  title: string;
  description: string;
}

export interface GameState {
  round: number; // Current round (1-6)
  week: number; // Week number for display
  sustainability: number;
  productivityIndex: number;
  soilMoisture: number;
  soilPH: number; // Track soil pH
  temperature: number;
  rainfall: number;
  cropHealth: number;
  hand: Card[]; // Player's current hand (5 cards)
  deck: Card[]; // Remaining cards in deck
  discardPile: Card[]; // Discarded cards
  playedCards: PlayedCards[]; // History of played cards
  cardsUsedCount: Record<string, number>; // Track which cards used most
  currentScenario: RoundScenario | null; // Current round's scenario
  roundOutcomes: RoundOutcome[]; // Track how well player solved each round
  activePenalties: Penalty[]; // Active penalty objects
  lastCardPlayed?: Card; // Track last played card for consecutive checks
  discardsUsedThisRound: number; // Track discards used in current round
  consecutiveDefensiveCards: number; // Track consecutive defensive cards played
  loseReason?: string; // Reason for losing the game
  loseDetails?: string; // Detailed explanation of the loss
}

export interface PlayedCards {
  round: number;
  cards: Card[];
  effects: CardEffects;
}

export interface CardEffects {
  sustainability: number;
  productivityIndex: number;
  soilMoisture: number;
  soilPH: number;
  cropHealth: number;
}

export interface DataInfo {
  title: string;
  description: string;
  resolution: string;
  frequency: string;
  limitations: string;
  applications: string;
}

export interface RoundOutcome {
  round: number;
  scenarioTitle: string;
  cardsPlayed: Card[];
  effects: CardEffects;
}
