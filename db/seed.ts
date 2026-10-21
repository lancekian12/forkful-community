/**
 * Applies pending migrations and seeds starter recipes when the DB is empty.
 * Safe to run repeatedly — it runs automatically before `dev` and `build`.
 * Pass `--reset` to wipe all data and reseed.
 */
import { count } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";
import { likes, meals, reviews, subscribers } from "./schema";

type SeedMeal = typeof meals.$inferInsert & {
  reviews: { author: string; rating: number; body: string }[];
};

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);

const seedMeals: SeedMeal[] = [
  {
    title: "Juicy Cheese Burger",
    slug: "juicy-cheese-burger",
    image: "/assets/burger.jpg",
    summary:
      "A mouth-watering burger with a juicy beef patty and melted cheese, served in a soft toasted bun.",
    category: "Comfort",
    difficulty: "Easy",
    cookTime: 20,
    servings: 1,
    ingredients: [
      "200g ground beef",
      "1 brioche bun",
      "1 slice cheddar",
      "2 leaves lettuce",
      "2 slices tomato",
      "Salt and black pepper",
      "1 tsp neutral oil",
    ],
    steps: [
      "Season the ground beef with salt and pepper and gently form it into a patty slightly wider than the bun.",
      "Heat the oil in a pan over medium-high heat. Cook the patty for 2–3 minutes per side until well browned.",
      "Lay the cheese on the patty for the last minute and cover the pan so it melts.",
      "Toast the bun halves. Layer lettuce and tomato on the bottom half, add the patty and close it up. Serve hot.",
    ],
    creator: "John Doe",
    creatorEmail: "johndoe@example.com",
    createdAt: daysAgo(40),
    reviews: [
      { author: "Nina", rating: 5, body: "Simple and perfect. Smashed it a bit thinner for crispier edges." },
      { author: "Tom", rating: 4, body: "Great base recipe — I added pickles and caramelised onions." },
    ],
  },
  {
    title: "Spicy Coconut Curry",
    slug: "spicy-curry",
    image: "/assets/curry.jpg",
    summary:
      "A rich and spicy curry, infused with warm spices and simmered in creamy coconut milk.",
    category: "Indian",
    difficulty: "Medium",
    cookTime: 35,
    servings: 4,
    ingredients: [
      "500g mixed vegetables",
      "2 tbsp curry paste",
      "500ml coconut milk",
      "1 onion, diced",
      "2 cloves garlic",
      "1 thumb ginger",
      "2 tbsp oil",
      "Fresh coriander",
    ],
    steps: [
      "Cut the vegetables into bite-sized pieces.",
      "Soften the onion, garlic and ginger in oil, then add the vegetables and sauté until they start to soften.",
      "Stir in the curry paste and cook for one minute until fragrant.",
      "Pour in the coconut milk, bring to a gentle simmer and cook for about 15 minutes.",
      "Finish with coriander and serve with rice or warm bread.",
    ],
    creator: "Max Schwarz",
    creatorEmail: "max@example.com",
    createdAt: daysAgo(32),
    reviews: [
      { author: "Priya", rating: 5, body: "Weeknight staple now. A squeeze of lime at the end lifts it." },
      { author: "Leo", rating: 5, body: "Super forgiving — used whatever veg I had." },
      { author: "Ana", rating: 4, body: "Lovely. I'd add a little more paste next time." },
    ],
  },
  {
    title: "Homemade Dumplings",
    slug: "homemade-dumplings",
    image: "/assets/dumplings.jpg",
    summary:
      "Tender dumplings filled with savoury pork and vegetables, steamed to perfection.",
    category: "Asian",
    difficulty: "Hard",
    cookTime: 60,
    servings: 4,
    ingredients: [
      "300g minced pork",
      "1 cup finely shredded cabbage",
      "2 spring onions",
      "1 tbsp soy sauce",
      "1 tsp sesame oil",
      "1 tsp grated ginger",
      "30 dumpling wrappers",
    ],
    steps: [
      "Mix the pork, cabbage, spring onion, soy sauce, sesame oil and ginger until sticky.",
      "Place a spoonful of filling in the centre of each wrapper, wet the edges and pleat to seal.",
      "Line a steamer with baking paper and steam the dumplings for about 10 minutes.",
      "Serve hot with a dipping sauce of soy, black vinegar and chilli oil.",
    ],
    creator: "Emily Chen",
    creatorEmail: "emilychen@example.com",
    createdAt: daysAgo(25),
    reviews: [
      { author: "Kai", rating: 5, body: "Took a while to get the pleats right but so worth it." },
      { author: "Marta", rating: 5, body: "Froze half of them — great for lazy days." },
    ],
  },
  {
    title: "Classic Mac n Cheese",
    slug: "classic-mac-n-cheese",
    image: "/assets/macncheese.jpg",
    summary:
      "Creamy, cheesy baked macaroni — a comforting classic that's always a crowd-pleaser.",
    category: "Comfort",
    difficulty: "Easy",
    cookTime: 40,
    servings: 4,
    ingredients: [
      "300g macaroni",
      "40g butter",
      "3 tbsp flour",
      "600ml milk",
      "200g grated cheddar",
      "1/2 cup breadcrumbs",
      "Parsley, to garnish",
    ],
    steps: [
      "Boil the macaroni in salted water until just al dente, then drain.",
      "Melt the butter, whisk in the flour, then gradually whisk in the milk until thick. Stir in the cheese until melted.",
      "Fold the sauce through the macaroni.",
      "Transfer to a baking dish, top with breadcrumbs and bake at 200°C until golden.",
      "Rest for five minutes and garnish with parsley.",
    ],
    creator: "Laura Smith",
    creatorEmail: "laurasmith@example.com",
    createdAt: daysAgo(18),
    reviews: [
      { author: "Sam", rating: 4, body: "Kids loved it. Mustard powder in the sauce is a nice touch." },
    ],
  },
  {
    title: "Authentic Neapolitan Pizza",
    slug: "authentic-pizza",
    image: "/assets/pizza.jpg",
    summary:
      "Hand-stretched pizza with a tangy tomato sauce, fresh mozzarella and basil.",
    category: "Italian",
    difficulty: "Medium",
    cookTime: 30,
    servings: 2,
    ingredients: [
      "2 balls pizza dough",
      "200g crushed San Marzano tomatoes",
      "200g fresh mozzarella",
      "Fresh basil",
      "Olive oil",
      "Sea salt",
    ],
    steps: [
      "Let the dough rise until doubled in size.",
      "Stretch each ball by hand into a thin round, keeping the edges slightly thicker.",
      "Spread a thin layer of seasoned tomato, tear over the mozzarella and drizzle with olive oil.",
      "Bake on a preheated stone at your oven's highest setting for 8–12 minutes.",
      "Top with basil and slice while hot.",
    ],
    creator: "Mario Rossi",
    creatorEmail: "mariorossi@example.com",
    createdAt: daysAgo(12),
    reviews: [
      { author: "Giulia", rating: 5, body: "Less is more — this is the way." },
      { author: "Ben", rating: 4, body: "Preheating the stone for an hour made all the difference." },
    ],
  },
  {
    title: "Wiener Schnitzel",
    slug: "wiener-schnitzel",
    image: "/assets/schnitzel.jpg",
    summary:
      "Crispy, golden-brown breaded veal cutlet — the great Austrian classic.",
    category: "Classic",
    difficulty: "Medium",
    cookTime: 30,
    servings: 2,
    ingredients: [
      "2 veal cutlets",
      "1/2 cup flour",
      "2 eggs, beaten",
      "1 cup fine breadcrumbs",
      "Oil or clarified butter for frying",
      "1 lemon",
    ],
    steps: [
      "Pound the cutlets between baking paper to an even 4mm thickness and season.",
      "Coat each cutlet in flour, dip in egg, then press lightly into the breadcrumbs.",
      "Shallow-fry in hot fat, swirling the pan so the crust puffs, until golden on both sides.",
      "Drain briefly and serve with lemon wedges and potato salad.",
    ],
    creator: "Franz Huber",
    creatorEmail: "franzhuber@example.com",
    createdAt: daysAgo(7),
    reviews: [
      { author: "Hanna", rating: 5, body: "Swirling the pan for the puffy crust — game changer." },
    ],
  },
  {
    title: "Fresh Tomato Salad",
    slug: "fresh-tomato-salad",
    image: "/assets/tomato-salad.jpg",
    summary:
      "A light, bright salad of ripe tomatoes, fresh basil and a tangy balsamic dressing.",
    category: "Healthy",
    difficulty: "Easy",
    cookTime: 10,
    servings: 2,
    ingredients: [
      "4 ripe tomatoes",
      "Handful of basil",
      "2 tbsp extra virgin olive oil",
      "1 tbsp balsamic vinegar",
      "Flaky salt and pepper",
    ],
    steps: [
      "Slice the tomatoes and arrange them on a plate.",
      "Scatter over torn basil and season generously.",
      "Drizzle with olive oil and balsamic just before serving.",
    ],
    creator: "Sophia Green",
    creatorEmail: "sophiagreen@example.com",
    createdAt: daysAgo(3),
    reviews: [
      { author: "Iris", rating: 4, body: "Only as good as your tomatoes — summer ones are unbeatable." },
    ],
  },
];

async function main() {
  await migrate(db, { migrationsFolder: "./db/migrations" });

  if (process.argv.includes("--reset")) {
    await db.delete(likes);
    await db.delete(reviews);
    await db.delete(meals);
    await db.delete(subscribers);
  }

  const { n } = (await db.select({ n: count() }).from(meals).get())!;
  if (n > 0) return;

  await db.transaction(async (tx) => {
    for (const { reviews: mealReviews, ...meal } of seedMeals) {
      const { id } = (await tx.insert(meals).values(meal).returning({ id: meals.id }).get())!;
      await tx.insert(reviews).values(mealReviews.map((r) => ({ ...r, mealId: id })));
    }
  });

  console.log(`Seeded ${seedMeals.length} recipes.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
