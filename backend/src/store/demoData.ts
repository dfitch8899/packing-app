import type { InspirationCard, StoreData, Trip } from "./types";

const categories = [
  { id: "clothing", name: "Clothing" },
  { id: "toiletries", name: "Toiletries" },
  { id: "tech", name: "Tech" },
  { id: "essentials", name: "Essentials" },
];

function checklistItem(
  id: string,
  text: string,
  categoryId: string,
  quantity: number,
  completed: boolean
) {
  return { id, text, categoryId, quantity, completed };
}

function isoDate(ymd: string) {
  // Assume Y-M-D, interpret as UTC-ish.
  return new Date(`${ymd}T00:00:00.000Z`).toISOString();
}

function kyotoTrip(): Trip {
  return {
    id: "kyoto",
    name: "Kyoto",
    location: "Kyoto, Japan",
    startDate: isoDate("2026-10-12"),
    endDate: isoDate("2026-10-24"),
    checklistCategories: categories,
    checklistItems: [
      checklistItem("sw-sweaters", "Merino Wool Sweaters", "clothing", 2, false),
      checklistItem("rw-rainjacket", "Lightweight Rain Jacket", "clothing", 1, true),
      checklistItem("sw-walkingshoes", "Comfortable Walking Shoes", "essentials", 1, false),
      checklistItem("cl-eveningtrousers", "Evening Trousers", "clothing", 2, false),
      checklistItem("tl-undergarments", "Undergarments", "clothing", 8, true),
    ],
    participants: [
      { id: "p1", name: "Avery", ready: true },
      { id: "p2", name: "Noah", ready: false },
      { id: "p3", name: "Mina", ready: true },
    ],
    weather: {
      summary: { minC: 12, maxC: 18, label: "Rain expected this week" },
      forecast: [
        { day: "Mon", minC: 12, maxC: 18, condition: "Rain showers" },
        { day: "Tue", minC: 11, maxC: 17, condition: "Cool and cloudy" },
        { day: "Wed", minC: 13, maxC: 18, condition: "Light rain" },
        { day: "Thu", minC: 12, maxC: 19, condition: "Overcast" },
        { day: "Fri", minC: 11, maxC: 18, condition: "Intermittent rain" },
        { day: "Sat", minC: 10, maxC: 17, condition: "Breezy" },
        { day: "Sun", minC: 12, maxC: 18, condition: "Mild rain clearing" },
      ],
    },
    packingStrategy: {
      recommended: [
        {
          id: "ps-layering",
          text: "Pack layers with water resistance",
          rationale:
            "Cool evenings plus on-and-off rain means you’ll stay comfortable by combining warmth and quick-drying outerwear.",
        },
        {
          id: "ps-walkcomfort",
          text: "Prioritize walking comfort",
          rationale:
            "Expect lots of walking; supportive footwear keeps the trip enjoyable even when the weather is unsettled.",
        },
      ],
    },
    shared: {
      commonItems: [
        { id: "ci-umbrella", text: "Compact umbrella", quantity: 2, assignedTo: "p1" },
        { id: "ci-charger", text: "Multi-port charger", quantity: 1, assignedTo: "p3" },
        { id: "ci-firstaid", text: "Mini first-aid kit", quantity: 1, assignedTo: "p2" },
      ],
    },
  };
}

function parisTrip(): Trip {
  return {
    id: "paris",
    name: "Paris",
    location: "Paris, France",
    startDate: isoDate("2026-09-01"),
    endDate: isoDate("2026-09-14"),
    checklistCategories: categories,
    checklistItems: [
      checklistItem("sw-sweaters", "Merino Wool Sweaters", "clothing", 2, true),
      checklistItem("rw-rainjacket", "Lightweight Rain Jacket", "clothing", 1, true),
      checklistItem("sw-walkingshoes", "Comfortable Walking Shoes", "essentials", 1, true),
      checklistItem("cl-eveningtrousers", "Evening Trousers", "clothing", 2, true),
      checklistItem("tl-undergarments", "Undergarments", "clothing", 8, true),
    ],
    participants: [
      { id: "p1", name: "Avery", ready: true },
      { id: "p2", name: "Noah", ready: true },
      { id: "p3", name: "Mina", ready: true },
    ],
    weather: {
      summary: { minC: 16, maxC: 24, label: "Comfortable with mild showers" },
      forecast: [
        { day: "Mon", minC: 16, maxC: 23, condition: "Partly cloudy" },
        { day: "Tue", minC: 17, maxC: 24, condition: "Light rain" },
        { day: "Wed", minC: 18, maxC: 25, condition: "Sunny spells" },
        { day: "Thu", minC: 16, maxC: 22, condition: "Cool breeze" },
        { day: "Fri", minC: 17, maxC: 23, condition: "Cloudy" },
        { day: "Sat", minC: 18, maxC: 24, condition: "Mild showers" },
        { day: "Sun", minC: 16, maxC: 23, condition: "Overcast" },
      ],
    },
    packingStrategy: {
      recommended: [
        {
          id: "ps-style",
          text: "Choose one “hero” outfit per day",
          rationale:
            "A curated wardrobe keeps you looking polished without overpacking. Mix layers for variable weather.",
        },
      ],
    },
    shared: {
      commonItems: [
        { id: "ci-umbrella", text: "Compact umbrella", quantity: 2, assignedTo: "p2" },
        { id: "ci-charger", text: "Multi-port charger", quantity: 1, assignedTo: "p1" },
      ],
    },
  };
}

function reykjavikTrip(): Trip {
  return {
    id: "reykjavik",
    name: "Reykjavik",
    location: "Reykjavik, Iceland",
    startDate: isoDate("2026-12-05"),
    endDate: isoDate("2026-12-12"),
    checklistCategories: categories,
    checklistItems: [
      checklistItem("sw-sweaters", "Merino Wool Sweaters", "clothing", 2, false),
      checklistItem("rw-rainjacket", "Lightweight Rain Jacket", "clothing", 1, false),
      checklistItem("sw-walkingshoes", "Comfortable Walking Shoes", "essentials", 1, false),
      checklistItem("cl-eveningtrousers", "Evening Trousers", "clothing", 2, false),
      checklistItem("tl-undergarments", "Undergarments", "clothing", 8, false),
    ],
    participants: [
      { id: "p1", name: "Avery", ready: false },
      { id: "p2", name: "Noah", ready: false },
      { id: "p3", name: "Mina", ready: false },
    ],
    weather: {
      summary: { minC: -1, maxC: 4, label: "Cold and windy" },
      forecast: [
        { day: "Mon", minC: -1, maxC: 3, condition: "Windy with drizzle" },
        { day: "Tue", minC: -2, maxC: 2, condition: "Cloudy" },
        { day: "Wed", minC: -1, maxC: 4, condition: "Light snow" },
        { day: "Thu", minC: -3, maxC: 1, condition: "Freezing" },
        { day: "Fri", minC: -2, maxC: 2, condition: "Overcast" },
        { day: "Sat", minC: -1, maxC: 3, condition: "Gusty" },
        { day: "Sun", minC: -2, maxC: 2, condition: "Drizzle" },
      ],
    },
    packingStrategy: {
      recommended: [
        {
          id: "ps-windproof",
          text: "Focus on windproof warmth",
          rationale:
            "Cold plus wind means your layers should retain heat and block airflow for comfortable walks.",
        },
        {
          id: "ps-hotdrinks",
          text: "Bring a compact thermal option",
          rationale:
            "Warm drinks can turn short breaks into relief; it’s a small item with big payoff.",
        },
      ],
    },
    shared: {
      commonItems: [
        { id: "ci-firstaid", text: "Mini first-aid kit", quantity: 1, assignedTo: "p2" },
      ],
    },
  };
}

const inspirations: InspirationCard[] = [
  {
    id: "insp-kyoto-minimal",
    destination: "Kyoto",
    title: "Quiet afternoons, soft layers",
    description:
      "A calm kit built around temperature swings and rainy pauses. Prioritize comfort and subtle texture.",
    imageUrl:
      "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "insp-paris-editorial",
    destination: "Paris",
    title: "Editorial packing, effortless style",
    description:
      "A curated wardrobe with one hero look per day and smart layering for mild showers.",
    imageUrl:
      "https://images.unsplash.com/photo-1526779259212-6f74a8d7d8cb?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "insp-reykjavik-warm",
    destination: "Reykjavik",
    title: "Windproof warmth for the city",
    description:
      "Cold-ready layers and small comfort upgrades so you can roam longer without rushing back.",
    imageUrl:
      "https://images.unsplash.com/photo-1509099836639-18ba1792bb5b?auto=format&fit=crop&w=900&q=70",
  },
];

export function createSeedData(): StoreData {
  const seedTrips = [kyotoTrip(), parisTrip(), reykjavikTrip()];
  return {
    trips: seedTrips,
    inspirations,
  };
}

