export const CATEGORIES = [
  "Comfort",
  "Asian",
  "Italian",
  "Indian",
  "Healthy",
  "Classic",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
