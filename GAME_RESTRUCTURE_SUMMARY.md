# Game Restructure Summary: 6-Round Problem-Solving System

## Overview

Successfully restructured the NASA Farm Navigator game from a 12-round card combo system to a **6-round problem-solving scenario system** where each round presents a specific farming challenge that players must solve using NASA satellite data and farming actions.

---

## Major Changes

### 1. **New Scenario System** (`src/data/scenarios.ts`)

Created a comprehensive scenario system defining 6 unique rounds:

#### Round 1 - Week 1: "Acidic Soil Discovery"

- **Problem**: Poor seedling establishment due to pH 5.3
- **Optimal Solution**: Landsat Field Map + Heavy Lime + Precision Discount
- **Learning**: pH management is crucial for nutrient uptake

#### Round 2 - Week 2: "Heavy Rain Warning" 🌧️

- **Problem**: 80mm rainfall forecasted, risk of waterlogging
- **Event**: GPM alert showing major storm
- **Optimal Solution**: GPM Forecast + Conservation Tillage + Mulch
- **Key Lesson**: DON'T irrigate or fertilize before rain = disaster!

#### Round 3 - Week 3: "Post-Storm Recovery"

- **Problem**: Nitrogen lost to leaching, crops showing deficiency
- **Optimal Solution**: MODIS + SMAP + Variable-Rate Fertilizer + Multi-Sensor Combo
- **Learning**: Data-driven precision fertilization after weather events

#### Round 4 - Week 4: "Extreme Heat Wave" 🔥

- **Problem**: 38°C for 5 days, moisture critical
- **Event**: ECOSTRESS shows heat stress across farm
- **Optimal Solution**: ECOSTRESS + SMAP + Precision Drip + Efficiency Boost
- **Key Lesson**: Emergency irrigation saves crops during heat stress

#### Round 5 - Week 5: "Pest Outbreak" 🐛

- **Problem**: Aphid population exploded after heat stress
- **Event**: 30% of fields affected
- **Optimal Solution**: MODIS + Biological Control (sustainable approach)
- **Learning**: Stressed crops are vulnerable to pests

#### Round 6 - Week 6: "Pre-Harvest Optimization"

- **Problem**: Final push to maximize yield
- **Event**: Perfect weather for grain maturation
- **Optimal Solution**: MODIS + Light Fertilizer + Cover Crop
- **Learning**: Planning for next season while harvesting

---

### 2. **Updated Game Types** (`src/types/game.ts`)

Added new fields to `GameState`:

```typescript
{
  round: number;        // Now 1-6 instead of 1-12
  week: number;         // Display week number
  soilPH: number;       // Track soil pH
  currentScenario: RoundScenario | null;
  roundOutcomes: RoundOutcome[];
}
```

New interfaces:

- `RoundOutcome`: Tracks player's solution quality for each round
- Links to `RoundScenario` from scenarios.ts

---

### 3. **Enhanced Game Logic** (`src/utils/gameLogic.ts`)

#### New Functions:

- `loadScenarioForRound(round)`: Loads the scenario for current round
- `applyScenarioAutoEffects(gameState, scenario)`: Applies weather events (rain, heat)
- `evaluatePlayerSolution(scenario, cards, effects)`: Evaluates if player found optimal/good/bad solution
- `detectComboWithScenario(cards, gameState, scenario)`: Enhanced combo detection with scenario bonuses

#### Updated Functions:

- `calculateResults()`: New 6-round grading system
  - **A Grade**: $20,000+ profit, 90%+ sustainability, 95%+ health
  - **B Grade**: $16,000+ profit, 70%+ sustainability, 80%+ health
  - **C Grade**: $11,500+ profit, 50%+ sustainability, 60%+ health
  - **D Grade**: Below thresholds
- `checkWinCondition()`: Changed to check for round > 6
- `checkLoseCondition()`: Adjusted thresholds for 6-round game

#### Scenario Evaluation System:

- **Optimal**: Player used the exact best solution → +1.5x multiplier, +$500
- **Good**: Player used an alternative good solution → +1.2x multiplier, +$200
- **Mediocre**: Partial solution → Normal effects
- **Bad**: Wrong cards for the problem → 0.7x penalty, -$200
- **Disaster**: Known bad combos (e.g., irrigate before rain) → 0.3x penalty, -$500, -20% sustainability

---

### 4. **Updated UI Components**

#### IntroScreen (`src/components/IntroScreen.tsx`)

- Updated starting conditions: $8,000, 60% health, pH 5.3, NDVI 0.40
- Changed from "12-round season" to "6 critical weeks"
- Added example challenges showing the problem-solving structure
- Updated instructions to focus on reading problems and finding optimal solutions

#### PlayingScreen (`src/components/PlayingScreen.tsx`)

- **Round Counter**: Now shows "Round X / 6 • Week Y"
- **Scenario Alert Banner**: Displays weather event alerts at top (rain 🌧️, heat 🔥, pests 🐛)
- **Problem Display**: Center area shows:
  - Scenario title
  - Problem description
  - Visible symptoms
  - Warnings (pH levels, NDVI, moisture, temperature)
  - Hints on what to do
- **Event-based styling**: Different colors for different event types

#### ResultsScreen (`src/components/ResultsScreen.tsx`)

- **Round-by-Round Performance**: Shows all 6 rounds with:
  - Cards played
  - Solution quality badge (Optimal/Good/Mediocre/Bad/Disaster)
  - Evaluation message
  - Effects achieved
- **Solution Quality Breakdown**: Count of optimal vs bad decisions
- **Decision-Making Analysis**: Key takeaways about problem diagnosis

---

### 5. **Main Game Flow** (`src/app/page.tsx`)

Updated flow:

1. **Start Game**: Load Round 1 scenario
2. **Each Round**:
   - Display scenario problem and symptoms
   - Player selects cards
   - System evaluates against optimal solution
   - Apply effects and scenario auto-effects (weather)
   - Move to next round with new scenario
3. **End Game**: After 6 rounds or lose condition
4. **Results**: Show performance analysis with solution quality ratings

New hooks:

- `useEffect`: Automatically loads scenario when round changes
- Scenario-aware combo detection
- Solution evaluation and outcome tracking

---

## Starting Conditions (Week 0)

Aligned with your example:

- **Money**: $8,000
- **Crop Health**: 60%
- **Sustainability**: 50%
- **Soil Moisture**: 45%
- **Soil pH**: 5.3 (acidic - first problem!)
- **NDVI**: 0.40 (early growth, stressed)
- **Temperature**: 22°C

---

## Grading System (6 Rounds)

### A Grade - "Climate-Smart Master" 🏆

- Final Profit: >$20,000
- Sustainability: >90%
- Crop Health: >95%
- Message: "Perfect data-driven farming! You used NASA data to predict events and made optimal decisions."

### B Grade - "Solid Farmer" ✓

- Final Profit: $16,000-20,000
- Sustainability: 70-90%
- Crop Health: 80-95%
- Message: "Good NASA data integration, handled most events well."

### C Grade - "Struggling Farm" ⚠️

- Final Profit: $11,500-16,000
- Sustainability: 50-70%
- Crop Health: 60-80%
- Message: "Needs better resource management and data usage."

### D Grade - "Farm Crisis" ❌

- Final Profit: <$11,500
- Sustainability: <50%
- Crop Health: <60%
- Message: "Major losses! Ignored satellite warnings and made poor decisions."

---

## Key Learning Points

### Problem Diagnosis is Crucial

Players must read and understand the problem before selecting cards. Each scenario has specific symptoms and warnings.

### NASA Data Guides Solutions

Optimal solutions always include NASA data cards to diagnose before taking action:

- **SMAP** → Check moisture before irrigation
- **MODIS** → Check crop health before fertilizing
- **GPM** → Check rain forecast to avoid waste
- **ECOSTRESS** → Check heat stress
- **Landsat** → Map field variability

### Timing Matters with Events

- Round 2: DON'T irrigate before heavy rain
- Round 4: MUST irrigate during heat wave
- Round 5: Address pest outbreak quickly

### Sustainability Affects Long-term Success

Good solutions balance immediate needs with environmental responsibility.

---

## Special Combo Bonuses

### 🏆 OPTIMAL SOLUTION

- 1.5x multiplier on all effects
- +$500 bonus
- Appears when player uses exact optimal card combination

### 📡 DATA-DRIVEN DECISION

- +$300 bonus
- NASA data paired with matching action

### 🚨 CRISIS MANAGEMENT

- +$200 bonus
- 2+ cards addressing critical stat (<40%)

### 🌱 SUSTAINABLE FARMING

- +20% sustainability bonus
- 3+ sustainability cards without reducing it

### 💸 WASTE WARNING

- -$300 penalty
- Expensive cards not addressing worst stats

### 🚫 DISASTER

- 0.3x penalty
- -$500, -20% sustainability
- Triggered by known bad combos (irrigate before rain, ignore heat wave)

---

## Technical Implementation

### Files Created

- `src/data/scenarios.ts` - Scenario definitions and evaluation logic

### Files Modified

- `src/types/game.ts` - Added scenario and outcome types
- `src/utils/gameLogic.ts` - Scenario loading, evaluation, and enhanced combo detection
- `src/app/page.tsx` - Updated game flow for 6 rounds with scenarios
- `src/components/IntroScreen.tsx` - Updated instructions and starting conditions
- `src/components/PlayingScreen.tsx` - Added scenario display and event alerts
- `src/components/ResultsScreen.tsx` - Added round-by-round performance analysis

### No Breaking Changes

- All existing card definitions preserved
- Existing combo system enhanced, not replaced
- Card effects still work the same way
- Added new evaluation layer on top

---

## Testing Recommendations

1. **Round 1**: Test pH correction with lime cards
2. **Round 2**: Test disaster scenario (irrigate before rain)
3. **Round 3**: Test multi-sensor data bonus
4. **Round 4**: Test heat wave emergency (no irrigation = disaster)
5. **Round 5**: Test sustainable vs chemical pest control
6. **Round 6**: Test cover crop for next season bonus

---

## Future Enhancements (Optional)

1. **Variable Events**: Randomize which event occurs in Round 2/4/5
2. **Difficulty Levels**: Easy (more forgiving), Hard (stricter thresholds)
3. **Tutorial Mode**: Highlight optimal cards for first-time players
4. **Achievement System**: Track perfect rounds across playthroughs
5. **More Scenarios**: Add 3-4 more scenarios and randomize order
6. **Weather Forecasting**: Give hints about upcoming events

---

## Summary

The game is now a **structured problem-solving experience** rather than a freeform card game. Each round teaches specific precision agriculture concepts:

- pH management
- Weather-responsive decisions
- Post-storm recovery
- Heat stress management
- Integrated pest management
- Pre-harvest optimization

Players learn that **NASA satellite data is essential for optimal farming decisions**, matching the educational goals of the NASA Space Apps Challenge.
