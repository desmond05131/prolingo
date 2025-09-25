export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh";

// Central palette (primary colors requested)
export const PRIMARY_COLORS = [
  "#E4D6A7", // tan
  "#E9B44C", // orange
  "#FF6978", // pink
  "#9799CA", // periwinkle
  "#2D936C", // teal-green
  "#AEC3CE", // muted blue-grey
  "#FFF6D2", // pale cream
  "#CB2749", // deep crimson
  "#9B8C79", // earthy taupe
  "#FFA531", // vibrant amber
  "#1F4433", // deep forest green
  "#024943", // dark teal
];

// Mock streak check-ins for current month (ISO date strings)
// NOTE: Replace with backend-provided data later.
export const MOCK_STREAK_CHECKINS = (() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  // Pretend user checked in daily for last 8 days and sporadically earlier.
  const dates = new Set();
  for (let i = 0; i < 8; i++) {
    const d = new Date(year, month, today.getDate() - i);
    dates.add(d.toISOString().slice(0, 10));
  }
  // Add two earlier random days this month
  dates.add(new Date(year, month, 2).toISOString().slice(0, 10));
  dates.add(new Date(year, month, 5).toISOString().slice(0, 10));
  return Array.from(dates).sort();
})();

// Slightly darkened counterparts for borders (manually picked ~15-20% darker)
const BORDER_COLORS = {
  "#E4D6A7": "#C1B58D",
  "#E9B44C": "#BF8F3D",
  "#FF6978": "#CC5460",
  "#9799CA": "#7476A2",
  "#2D936C": "#227352",

  "#AEC3CE": "#8B9CA5",
  "#FFF6D2": "#CCC5A8",
  "#CB2749": "#A21F3A",
  "#9B8C79": "#7C7060",
  "#FFA531": "#CC8427",
  // "#1F4433": "#173428",
  // "#024943": "#01332F",
};

export const units = [
  {
    unitNumber: 1,
    description: "Introduction to C++",
    backgroundColor: "bg-[#CC8427]",
    textColor: "text-[#CC8427]",
    borderColor: "border-[#FFA531]",
    tiles: [
      { type: "star", description: "Form basic sentences" },
      { type: "book", description: "Good morning" },
      { type: "star", description: "Greet people" },
      // { type: "treasure" },
      { type: "book", description: "A date" },
      { type: "trophy", description: "Unit 1 review" },
    ],
  },
  {
    unitNumber: 2,
    description: "The Syntax",
    backgroundColor: "bg-[#A21F3A]",
    textColor: "text-[#A21F3A]",
    borderColor: "border-[#CB2749]",
    tiles: [
      { type: "fast-forward", description: "Get around in a city" },
      { type: "dumbbell", description: "Personalized practice" },
      { type: "book", description: "One thing" },
      // { type: "treasure" },
      { type: "star", description: "Get around in a city" },
      { type: "book", description: "A very big family" },
      { type: "star", description: "Greet people" },
      { type: "book", description: "The red jacket" },
      // { type: "treasure" },
      { type: "dumbbell", description: "Personalized practice" },
      { type: "trophy", description: "Unit 2 review" },
    ],
  },
  {
    unitNumber: 3,
    description: "How to loop",
    backgroundColor: "bg-[#7C7060]",
    textColor: "text-[#7C7060]",
    borderColor: "border-[#9B8C79]",
    tiles: [
      { type: "fast-forward", description: "Order food and drink" },
      { type: "book", description: "The passport" },
      { type: "star", description: "Order food and drinks" },
      // { type: "treasure" },
      { type: "book", description: "The honeymoon" },
      { type: "star", description: "Get around in a city" },
      // { type: "treasure" },
      { type: "dumbbell", description: "Personalized practice" },
      { type: "book", description: "Doctor Eddy" },
      { type: "trophy", description: "Unit 2 review" },
    ],
  },
];

export const questions = [
  {
    id: 1,
    question_type: "mcq",
    question_text: "What is the capital of France?",
    options: [
      { id: 1, option_text: "Berlin" },
      { id: 2, option_text: "Madrid" },
      { id: 3, option_text: "Paris" },
      { id: 5, option_text: "Paris" },
      { id: 6, option_text: "Paris" },
      { id: 7, option_text: "Paris" },
      { id: 8, option_text: "Paris" },
      { id: 9, option_text: "Paris" },
      { id: 4, option_text: "Rome" },
    ],
    correct_option_id: 3,
  },
  {
    id: 2,
    question_type: "fill",
    question_text: "What is the capital of France?",
    correct_answer: "Paris",
  },
];

// Mock profile + subscription data (UI only; replace with API calls later)
export const MOCK_PROFILE = {
  id: "user_123",
  name: "Jane Developer",
  email: "jane.developer@example.com",
  avatarUrl: "/public/assets/Logo.png", // fallback asset
  badges: [
    // Added imageUrl for visual circular badge display in ProfileBanner
    { id: "b1", label: "Early", color: "#E9B44C", imageUrl: "/public/assets/Achievements.svg" },
    { id: "b2", label: "Streak", color: "#2D936C", imageUrl: "/public/assets/Streak.svg" },
    { id: "b3", label: "Champion", color: "#CB2749", imageUrl: "/public/assets/Leaderboard.svg" },
    { id: "b4", label: "Beta", color: "#9799CA", imageUrl: "/public/assets/Settings.svg" },
  ],
  subscription: {
    plan: "Free",
    renewsOn: null,
  },
};

export const MOCK_SUBSCRIPTION_PLANS = [
  { id: "free", name: "Free", price: 0, features: ["Basic lessons", "Community leaderboard"] },
  { id: "pro", name: "Pro", price: 9.99, features: ["All lessons", "Unlimited tests", "Priority support"] },
  { id: "team", name: "Team", price: 39.0, features: ["Team management", "Shared progress", "Reports"] },
];

// Paid subscription (single-user) upgrade plan mock data for Subscription page cards
// Tailored to highlight benefits: more XP, streak saver, faster energy regeneration.
export const MOCK_SUBSCRIPTION_PLANS_PAID = [
  {
    id: "monthly",
    name: "Monthly",
    cadence: "Billed monthly",
    price: 7.99,
    priceLabel: "$7.99/mo",
    highlight: "Flexible access",
    savingsNote: null,
    perks: [
      "+20% XP boost on lessons",
      "1 Streak Saver per month included",
      "Energy refills 25% faster",
      "Access to all current & future units",
      "Priority in new feature betas"
    ],
  },
  {
    id: "annual",
    name: "Annual",
    cadence: "Billed yearly",
    price: 79.99,
    priceLabel: "$79.99/yr",
    highlight: "Best value",
    savingsNote: "Save 17% vs monthly",
    perks: [
      "+25% XP boost on lessons",
      "2 Streak Savers per month included",
      "Energy refills 35% faster",
      "Access to all current & future units",
      "Exclusive seasonal badge",
      "Priority in new feature betas"
    ],
    featured: true,
  },
];