export type EventType =
  | "rain"
  | "heatwave"
  | "pests"
  | "none"
  | "perfect"
  | "plague"
  | "wind";

export interface RoundScenario {
  round: number;
  week: number;
  title: string;
  problem: string;
  symptoms: {
    description: string;
    warnings: string[];
  };
  event: {
    type: EventType;
    alert?: string;
    icon?: string;
  };

  autoEffects?: {
    // Effects that happen automatically (like rainfall)
    soilMoisture?: number;
    temperature?: number;
    rainfall?: number;
    cropHealth?: number;
    productivityIndex?: number;
  };
}

export const SCENARIOS: RoundScenario[] = [
  // ROUND 1 - PLANTING/ESTABLISHMENT PHASE
  {
    round: 1,
    week: 1,
    title: "Planting Season Begins",
    problem: "Seeds planted, need optimal conditions for germination",
    symptoms: {
      description: "Freshly planted seeds need consistent moisture and warmth",
      warnings: [
        "Soil pH: 5.3 - ACIDIC (limiting nutrient uptake)",
        "Critical germination period - seeds need consistent moisture",
        "Temperature optimal for seed activation",
        "Monitor soil moisture closely for seedling emergence",
      ],
    },
    event: {
      type: "none",
    },
  },

  // ROUND 2 - PLANTING/ESTABLISHMENT PHASE
  {
    round: 2,
    week: 2,
    title: "Heavy Rain During Establishment",
    problem: "80mm rainfall forecasted - risk of seed washout and waterlogging",
    symptoms: {
      description: "Newly emerged seedlings vulnerable to heavy rain",
      warnings: [
        "GPM shows major storm incoming (80mm in 2 days)",
        "Risk of seed washout and seedling damage",
        "Waterlogging could suffocate young roots",
        "DO NOT IRRIGATE - natural rainfall sufficient",
      ],
    },
    event: {
      type: "rain",
      alert:
        "⚠️ GPM ALERT: Heavy rain (80mm). Risk of seed washout and waterlogging!",
      icon: "🌧️",
    },
    autoEffects: {
      temperature: 21,
      soilMoisture: 35,
      rainfall: 80,
    },
  },

  // ROUND 3 - EARLY VEGETATIVE GROWTH PHASE
  {
    round: 3,
    week: 3,
    title: "Early Vegetative Growth",
    problem: "Seedlings establishing, need nitrogen for leaf development",
    symptoms: {
      description: "Young plants showing nitrogen deficiency after heavy rain",
      warnings: [
        "Soil moisture high but declining (68%)",
        "Nitrogen lost to leaching from heavy rain",
        "Crops need nitrogen for leaf development",
        "Early vegetative growth phase critical for yield potential",
      ],
    },
    event: {
      type: "none",
    },
    autoEffects: {
      temperature: 24,
      rainfall: 5,
    },
  },

  // ROUND 4 - EARLY VEGETATIVE GROWTH PHASE
  {
    round: 4,
    week: 4,
    title: "Heat Stress on Young Plants",
    problem:
      "Temperature spikes to 38°C - young plants vulnerable to heat stress",
    symptoms: {
      description: "Heat stress affecting leaf expansion and root development",
      warnings: [
        "Temperature: 38°C - CRITICAL for young plants",
        "Soil moisture dropped 30% in one week (now 28%)",
        "ECOSTRESS shows heat stress across entire farm",
        "Young plants more susceptible to heat damage",
      ],
    },
    event: {
      type: "heatwave",
      alert:
        "🔥 HEAT WAVE! 38°C for 5 days. Young plants vulnerable to heat stress!",
      icon: "🌡️",
    },
    autoEffects: {
      temperature: 38,
      soilMoisture: -30,
    },
  },

  // ROUND 5 - ACTIVE VEGETATIVE GROWTH PHASE
  {
    round: 5,
    week: 5,
    title: "Active Vegetative Growth",
    problem:
      "Crops in rapid growth phase, need optimal conditions for biomass development",
    symptoms: {
      description:
        "Plants growing rapidly, need consistent moisture and nutrients",
      warnings: [
        "Active leaf and stem development phase",
        "High nutrient demand for biomass accumulation",
        "Crops need consistent soil moisture",
        "Temperature returning to optimal range",
      ],
    },
    event: {
      type: "perfect",
      alert:
        "☀️ PERFECT WEATHER: Ideal conditions for vegetative growth and biomass development.",
      icon: "☀️",
    },
    autoEffects: {
      temperature: 26,
      rainfall: 0,
    },
  },

  // ROUND 6 - ACTIVE VEGETATIVE GROWTH PHASE
  {
    round: 6,
    week: 6,
    title: "Pest Outbreak During Growth",
    problem: "Aphid outbreak during peak vegetative growth phase",
    symptoms: {
      description: "Aphid colonies feeding on rapidly growing plants",
      warnings: [
        "Aphid population exploded during growth phase",
        "30% of plants showing pest damage",
        "Pests targeting new growth and tender leaves",
        "Critical to protect biomass development",
      ],
    },
    event: {
      type: "pests",
      alert:
        "🐛 PEST ALERT: Aphid outbreak during peak growth! Protecting biomass development critical.",
      icon: "🐛",
    },
    autoEffects: {
      cropHealth: -0.3,
      temperature: 28,
      rainfall: 0,
    },
  },

  // ROUND 7 - FLOWERING/REPRODUCTIVE PHASE
  {
    round: 7,
    week: 7,
    title: "Flowering Stage Begins",
    problem: "Crops entering reproductive phase - critical for yield formation",
    symptoms: {
      description:
        "First flowers appearing, need optimal conditions for pollination",
      warnings: [
        "Flowering stage beginning - critical for yield",
        "Need optimal soil moisture for flower development",
        "Temperature and humidity critical for pollination",
        "Harvest in 5 weeks if flowering successful",
      ],
    },
    event: {
      type: "none",
    },
    autoEffects: {
      temperature: 28,
      rainfall: 0,
    },
  },

  // ROUND 8 - FLOWERING/REPRODUCTIVE PHASE
  {
    round: 8,
    week: 8,
    title: "Fungal Disease During Flowering",
    problem: "Fungal infection threatening flower development and pollination",
    symptoms: {
      description:
        "Fungal spores attacking flowers and reducing pollination success",
      warnings: [
        "Fungal infection spreading to 60% of fields",
        "Flowers being damaged by fungal spores",
        "Pollination success rate declining",
        "Critical to protect reproductive structures",
      ],
    },
    event: {
      type: "plague",
      alert:
        "🦠 PLAGUE ALERT: Fungal infection attacking flowers! Pollination at risk.",
      icon: "🦠",
    },
    autoEffects: {
      productivityIndex: -20,
      cropHealth: -0.25,
      temperature: 22,
      rainfall: 15,
    },
  },

  // ROUND 9 - GRAIN DEVELOPMENT PHASE
  {
    round: 9,
    week: 9,
    title: "Grain Development Begins",
    problem:
      "Successful pollination leads to grain formation - need optimal conditions",
    symptoms: {
      description:
        "Grains beginning to form, need consistent moisture and nutrients",
      warnings: [
        "Grain filling stage active - critical for yield",
        "Need consistent soil moisture for grain development",
        "Temperature optimal for grain filling",
        "Harvest in 3 weeks if grain development successful",
      ],
    },
    event: {
      type: "perfect",
      alert:
        "🌾 GRAIN DEVELOPMENT: Grains forming successfully. Critical period for final yield!",
      icon: "🌾",
    },
    autoEffects: {
      temperature: 24,
      rainfall: 0,
    },
  },

  // ROUND 10 - GRAIN DEVELOPMENT PHASE
  {
    round: 10,
    week: 10,
    title: "Drought During Grain Filling",
    problem: "No rainfall for 2 weeks - grain development at risk",
    symptoms: {
      description:
        "Extended dry period threatening grain filling and final yield",
      warnings: [
        "No rainfall for 14 days during grain filling",
        "Soil moisture at 15% - CRITICAL for grain development",
        "Grains not filling properly due to water stress",
        "Final yield potential declining rapidly",
      ],
    },
    event: {
      type: "heatwave",
      alert:
        "🏜️ DROUGHT ALERT: 14 days without rain during grain filling! Final yield at risk.",
      icon: "🏜️",
    },
    autoEffects: {
      temperature: 35,
      soilMoisture: -25,
      rainfall: 0,
      productivityIndex: -15,
    },
  },

  // ROUND 11 - MATURATION/HARVEST PREP PHASE
  {
    round: 11,
    week: 11,
    title: "Grain Maturation",
    problem: "Grains maturing, need dry conditions for harvest preparation",
    symptoms: {
      description:
        "Grains reaching physiological maturity, preparing for harvest",
      warnings: [
        "Grains reaching physiological maturity",
        "Need dry conditions for harvest preparation",
        "Soil moisture declining naturally (ideal for harvest)",
        "Harvest in 1 week if conditions remain favorable",
      ],
    },
    event: {
      type: "perfect",
      alert:
        "☀️ MATURATION: Grains reaching maturity. Perfect conditions for harvest prep!",
      icon: "☀️",
    },
    autoEffects: {
      temperature: 28,
      rainfall: 0,
    },
  },

  // ROUND 12 - MATURATION/HARVEST PREP PHASE
  {
    round: 12,
    week: 12,
    title: "Pre-Harvest Final Challenge",
    problem: "Final week before harvest - one last challenge to overcome",
    symptoms: {
      description:
        "Crops ready for harvest, but final weather challenge threatens yield",
      warnings: [
        "Harvest begins tomorrow",
        "Strong winds threatening to damage mature crops",
        "Need to protect crops from pre-harvest losses",
        "Final push to preserve yield potential",
      ],
    },
    event: {
      type: "wind",
      alert:
        "💨 WIND ALERT: 50 km/h winds before harvest! Protect mature crops from damage.",
      icon: "💨",
    },
    autoEffects: {
      temperature: 22,
      rainfall: 0,
      productivityIndex: -8,
    },
  },
];

// Helper function to get scenario for current round
export const getScenarioForRound = (round: number): RoundScenario | null => {
  return SCENARIOS.find((s) => s.round === round) || null;
};
