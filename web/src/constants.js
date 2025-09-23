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