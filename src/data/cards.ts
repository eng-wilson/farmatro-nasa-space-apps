export type CardType = "nasa_data" | "action" | "multiplier" | "emergency";

export interface Card {
  id: string;
  name: string;
  type: CardType;
  icon: string;
  description: string;
  effects: {
    sustainability?: number;
    productivityIndex?: number;
    soilMoisture?: number;
    soilPH?: number;
    cropHealth?: number;
  };
  comboTips: string[];
  nasaInfo?: {
    satellite: string;
    measurement: string;
    resolution: string;
    limitations: string;
  };
  specialEffect?: string;
  technicalDetails?: string;
  instanceId?: string;
}

export const CARDS: Card[] = [
  // IRRIGATION CARDS (4 cards - different water amounts)
  {
    id: "light_irrigation",
    name: "Sprinkler",
    type: "action",
    icon: "💧",
    description: "Maintains moisture",
    effects: {
      soilMoisture: 15,
      sustainability: -3,
      cropHealth: 0.05,
      soilPH: -0.4,
    },
    comboTips: ["Use when moisture 40-60%", "Maintenance dose"],
    technicalDetails: "150 m³/ha (15mm), 2-hour drip",
  },
  {
    id: "moderate_irrigation",
    name: "Drip irrigation",
    type: "action",
    icon: "💦",
    description: "Restore moderately the moisture",
    effects: {
      soilMoisture: 25,
      sustainability: -6,
      cropHealth: 0.06,
      soilPH: -0.8,
    },
    comboTips: ["Use when moisture 25-40%", "Most efficient"],
    technicalDetails: "300 m³/ha (30mm), 4-hour cycle",
  },
  {
    id: "heavy_irrigation",
    name: "Pivot irrigation",
    type: "action",
    icon: "🌊",
    description: "Full recharge of water, chance of flooding",
    effects: {
      soilMoisture: 50,
      sustainability: -15,
      productivityIndex: 15,
      cropHealth: -0.08,
      soilPH: -0.12,
    },
    comboTips: ["Use when moisture <25%", "May cause runoff"],
    technicalDetails: "500 m³/ha (50mm), 8+ hours",
    specialEffect: "WATERLOGGING_RISK",
  },
  {
    id: "precision_drip",
    name: "Precision Drip",
    type: "action",
    icon: "🎯",
    description: "Targets only the dry zones, saving water",
    effects: {
      soilMoisture: 20,
      sustainability: 5, // BUFFED: Smart technology saves resources
      productivityIndex: 10,
      cropHealth: 0.1,
      soilPH: -0.03,
    },
    comboTips: ["Requires SMAP data", "Targets deficits only"],
    technicalDetails: "Variable 100-400 m³/ha, GPS-controlled",
  },

  // FERTILIZER CARDS (2 cards - different N rates)
  {
    id: "light_fertilizer",
    name: "Composte",
    type: "action",
    icon: "🌾",
    description: "Low impact way of fertilizing",
    effects: {
      productivityIndex: 10,
      sustainability: -4,
      cropHealth: 0.06,
      soilPH: -0.5,
    },
    comboTips: ["Use when crop health >0.6", "Prevents deficiency"],
    technicalDetails: "40 kg N/ha urea",
  },
  {
    id: "standard_fertilizer",
    name: "Standard NPK",
    type: "action",
    icon: "🚜",
    description: "Full nutrition boost but costly",
    effects: {
      productivityIndex: 25,
      sustainability: -12,
      cropHealth: 0.1,
      soilPH: -0.8,
    },
    comboTips: ["Use when crop health 0.4-0.6", "Balanced dose"],
    technicalDetails: "120-60-60 NPK kg/ha",
    specialEffect: "NITROGEN_ACCUMULATION",
  },

  // pH MANAGEMENT CARDS (4 cards - adjust soil acidity/alkalinity)
  {
    id: "lime_light",
    name: "Truck load of lime",
    type: "action",
    icon: "🪨",
    description: "A small truck with lime to correct the PH",
    effects: {
      productivityIndex: 12,
      sustainability: -2,
      cropHealth: 0.07,
      soilPH: 1.8, // BUFFED: Extremely effective pH correction
    },
    comboTips: ["Use when pH 5.5-6.0", "Gradual pH increase"],
    technicalDetails: "1 ton/ha agricultural lime (CaCO₃)",
  },
  {
    id: "curative_fungicide",
    name: "Truck load of lime",
    type: "action",
    icon: "🪨",
    description: "A truck full of lime to correct the PH",
    effects: {
      productivityIndex: 25,
      sustainability: -4,
      cropHealth: 0.6,
      soilPH: 2.9,
    },
    comboTips: [
      "Use after crop health shows disease symptoms",
      "More chemicals needed",
    ],
    technicalDetails: "1.5 L/ha systemic fungicide, high application rate",
    specialEffect: "RESISTANCE_RISK",
  },
  {
    id: "lime_heavy",
    name: "Lime Shipment",
    type: "action",
    icon: "🗻",
    description: "A big ship full of lime to correct the PH",
    effects: {
      productivityIndex: 15,
      sustainability: -8,
      cropHealth: 0.08,
      soilPH: 4.0, // BUFFED: Incredibly powerful for major pH correction
    },
    comboTips: ["Use when pH <5.5", "Major correction needed"],
    technicalDetails: "3 tons/ha agricultural lime, slow release",
    specialEffect: "PH_OVERCORRECTION_RISK",
  },

  // SOIL HEALTH CARDS (3 cards - BUFFED SUSTAINABILITY RECOVERY)
  {
    id: "cover_crop",
    name: "Cover Crop",
    type: "action",
    icon: "🌱",
    description: "Prevents soil erosion with low cost",
    effects: {
      sustainability: 15, // BUFFED from 8 - Major regenerative practice
      soilMoisture: 5,
      cropHealth: 0.15,
      productivityIndex: 8,
    },
    comboTips: ["Long-term soil builder", "Reduces fertilizer needs"],
    technicalDetails: "Legume mix, 25 kg seed/ha",
  },
  {
    id: "mulching",
    name: "Organic Mulch",
    type: "action",
    icon: "🍂",
    description: "Secure the moisture in the soil",
    effects: {
      soilMoisture: 10,
      sustainability: 13, // BUFFED from 3 - Organic matter restoration
      cropHealth: 0.1,
      productivityIndex: 8,
    },
    comboTips: ["Works with drip", "Long-lasting effect"],
    technicalDetails: "5 cm depth, 50 tonnes/ha",
  },
  {
    id: "conservation_till",
    name: "No-Till",
    type: "action",
    icon: "🔧",
    description: "Protects the soil from the sun, holding the humidity",
    effects: {
      sustainability: 5, // BUFFED from 5 - Carbon sequestration + fuel savings
      soilMoisture: 12,
      cropHealth: 0.1,
      productivityIndex: 8,
    },
    comboTips: ["Protects soil", "Reduces costs"],
    technicalDetails: "Direct seeding, residue retention",
  },

  // PEST MANAGEMENT (2 cards)
  {
    id: "biocontrol",
    name: "Biological Control",
    type: "action",
    icon: "🐞",
    description: "Beneficial insects for pest suppression",
    effects: {
      productivityIndex: 18,
      sustainability: 10, // BUFFED from 4 - Ecosystem restoration
      cropHealth: 0.12,
    },
    comboTips: ["Use with temp data", "Timing matters"],
    technicalDetails: "Predator release, 50k insects/ha",
  },

  // DISEASE PROTECTION CARDS (3 cards)
  {
    id: "biocontrol_disease",
    name: "Biological Fungicide",
    type: "action",
    icon: "🦠",
    description: "Beneficial microbes suppress pathogens",
    effects: {
      productivityIndex: 12,
      sustainability: 8, // BUFFED from 3 - Soil microbiome health
      cropHealth: 0.08,
    },
    comboTips: ["Works best preventively", "Sustainable option"],
    technicalDetails: "Trichoderma/Bacillus application, preventive only",
  },

  // WEED CONTROL CARDS (3 cards)
  {
    id: "manual_weeding",
    name: "Manual Weeding",
    type: "action",
    icon: "✋",
    description: "Hand removal - Labor intensive, zero chemical",
    effects: {
      productivityIndex: 10,
      sustainability: 10, // BUFFED from 4 - Zero environmental impact
      cropHealth: 0.05,
    },
    comboTips: ["Best for small infestations", "Most sustainable"],
    technicalDetails: "Hand pulling, 20 hours labor/ha",
  },
  {
    id: "spot_herbicide",
    name: "Spot Herbicide",
    type: "action",
    icon: "🎯",
    description: "precise use of Herbicide",
    effects: {
      productivityIndex: 18,
      sustainability: -8,
      cropHealth: 0.2,
      soilPH: -0.2,
    },
    comboTips: ["Requires MODIS weed map", "60% less chemical"],
    technicalDetails: "Variable rate 0.2-0.8 L/ha, GPS-guided spray",
  },
  {
    id: "broadcast_herbicide",
    name: "Broadcast Herbicide",
    type: "action",
    icon: "💨",
    description: "Quick but wasteful",
    effects: {
      productivityIndex: 20,
      sustainability: -16,
      cropHealth: 0.25,
      soilPH: -0.18,
    },
    comboTips: ["Quick but wasteful", "Use when weeds are everywhere"],
    technicalDetails: "1.5 L/ha post-emergence herbicide, whole field",
    specialEffect: "RESISTANCE_RISK",
  },

  // DRAINAGE MANAGEMENT CARDS (3 cards)
  {
    id: "surface_drainage",
    name: "Surface Drainage Channels",
    type: "action",
    icon: "〰️",
    description: "Dig channels that drain the water away",
    effects: {
      soilMoisture: -15,
      sustainability: 0,
      productivityIndex: 5,
    },
    comboTips: ["Use after heavy rain", "Quick temporary fix"],
    technicalDetails: "Surface channels direct water away, seasonal",
  },
  {
    id: "subsurface_drainage",
    name: "Install Drainage Tiles",
    type: "action",
    icon: "🔩",
    description: "A more resource-heavy solution",
    effects: {
      soilMoisture: -15,
      sustainability: 0,
      productivityIndex: 15,
      cropHealth: 0.1,
    },
    comboTips: ["Use in chronic wet zones", "Long-term solution"],
    technicalDetails: "Perforated tiles 1m deep, permanent infrastructure",
  },
  {
    id: "emergency_pumping",
    name: "Emergency Pumping",
    type: "action",
    icon: "⚡",
    description: "Pump all the water out - very energy heavy",
    effects: {
      soilMoisture: -40,
      sustainability: -15,
      productivityIndex: 20,
      cropHealth: -0.2,
    },
    comboTips: ["Use when ponding detected", "Saves drowning crops"],
    technicalDetails: "High-capacity pumps remove water in 24-48 hours",
    specialEffect: "SOIL_STRUCTURE_DAMAGE",
  },

  // NASA DATA CARDS (4 cards - information gathering)
  {
    id: "landsat_cropHealth",
    name: "Landsat Analysis",
    type: "nasa_data",
    icon: "🛰️",
    description: "This NASA satellite gives High amounts of plant data ",
    effects: {
      cropHealth: 0.15,
      sustainability: 0,
    },
    comboTips: ["Use for field mapping", "Targets problem areas"],
    nasaInfo: {
      satellite: "Landsat 8/9",
      measurement: "Crop Health Index (Normalized Difference Vegetation Index)",
      resolution: "30m",
      limitations: "Cloud cover delays, 16-day revisit",
    },
    technicalDetails: "Landsat 8/9 OLI bands 4&5, 30m resolution, 16-day cycle",
  },
  {
    id: "modis_cropHealth",
    name: "MODIS Monitoring",
    type: "nasa_data",
    icon: "📡",
    description: "Information from this NASA satellite will identify plant health",
    effects: {
      cropHealth: 0.1,
      sustainability: 0,
    },
    comboTips: ["Daily updates", "Good for large fields"],
    nasaInfo: {
      satellite: "Terra/Aqua MODIS",
      measurement: "Crop Health Index (Normalized Difference Vegetation Index)",
      resolution: "250m",
      limitations: "Lower resolution, atmospheric interference",
    },
    technicalDetails: "MODIS bands 1&2, 250m resolution, daily coverage",
  },
];

// Helper functions
export const getCardsByType = (type: CardType): Card[] => {
  return CARDS.filter((card) => card.type === type);
};

export const createDeck = (copiesPerCard: number = 3): Card[] => {
  const deck: Card[] = [];
  CARDS.forEach((card) => {
    for (let i = 0; i < copiesPerCard; i++) {
      deck.push({
        ...card,
        instanceId: `${card.id}_${i}`,
      });
    }
  });
  return deck;
};

export const shuffleDeck = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const drawCards = (deck: Card[], count: number): Card[] => {
  return deck.slice(0, count);
};
