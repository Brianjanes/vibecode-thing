import { Deck } from "@/lib/db/models/deck";
import { Format } from "@/lib/db/models/format";
import { User } from "@/lib/db/models/user";
import { connectDB } from "@/lib/db/mongoose";

const SAMPLE_USERS = [
  {
    clerkId: "user_1",
    username: "SpikeMTG",
    email: "spike@example.com",
    imageUrl: "https://example.com/spike.jpg",
    preferences: {
      defaultFormat: "Modern",
      showPrices: true,
      theme: "dark",
    },
    stats: {
      totalDecks: 0,
      publicDecks: 0,
      favoriteFormats: ["Modern", "Standard"],
      favoriteColors: ["R", "B"],
    },
  },
  {
    clerkId: "user_2",
    username: "JohnnyCombo",
    email: "johnny@example.com",
    imageUrl: "https://example.com/johnny.jpg",
    preferences: {
      defaultFormat: "Commander",
      showPrices: true,
      theme: "system",
    },
    stats: {
      totalDecks: 0,
      publicDecks: 0,
      favoriteFormats: ["Commander", "Modern"],
      favoriteColors: ["U", "G"],
    },
  },
  {
    clerkId: "user_3",
    username: "TimmiePower",
    email: "timmie@example.com",
    imageUrl: "https://example.com/timmie.jpg",
    preferences: {
      defaultFormat: "Standard",
      showPrices: true,
      theme: "light",
    },
    stats: {
      totalDecks: 0,
      publicDecks: 0,
      favoriteFormats: ["Standard", "Pioneer"],
      favoriteColors: ["G", "W"],
    },
  },
];

const SAMPLE_DECKS = [
  {
    name: "Mono Red Burn",
    format: "Modern",
    cards: [
      {
        card: {
          id: "lightning-bolt",
          name: "Lightning Bolt",
          mana_cost: "{R}",
          type_line: "Instant",
          cmc: 1,
        },
        quantity: 4,
        isSideboard: false,
      },
      {
        card: {
          id: "monastery-swiftspear",
          name: "Monastery Swiftspear",
          mana_cost: "{R}",
          type_line: "Creature — Human Monk",
          cmc: 1,
        },
        quantity: 4,
        isSideboard: false,
      },
    ],
    author: {
      id: "user_1",
      name: "SpikeMTG",
    },
    isPublic: true,
    colors: ["R"],
    description: "Classic Modern burn deck",
    tags: ["aggro", "burn"],
  },
  {
    name: "Esper Control",
    format: "Standard",
    cards: [
      {
        card: {
          id: "counterspell",
          name: "Counterspell",
          mana_cost: "{U}{U}",
          type_line: "Instant",
          cmc: 2,
        },
        quantity: 4,
        isSideboard: false,
      },
      {
        card: {
          id: "fatal-push",
          name: "Fatal Push",
          mana_cost: "{B}",
          type_line: "Instant",
          cmc: 1,
        },
        quantity: 3,
        isSideboard: false,
      },
    ],
    author: {
      id: "user_2",
      name: "JohnnyCombo",
    },
    isPublic: true,
    colors: ["W", "U", "B"],
    description: "Control deck featuring the best cards in Esper colors",
    tags: ["control", "midrange"],
  },
  {
    name: "Green Stompy",
    format: "Pioneer",
    cards: [
      {
        card: {
          id: "steel-leaf-champion",
          name: "Steel Leaf Champion",
          mana_cost: "{G}{G}{G}",
          type_line: "Creature — Elf Knight",
          cmc: 3,
        },
        quantity: 4,
        isSideboard: false,
      },
    ],
    author: {
      id: "user_3",
      name: "TimmiePower",
    },
    isPublic: false,
    colors: ["G"],
    description: "Big green creatures",
    tags: ["aggro", "creatures"],
  },
];

const SAMPLE_FORMATS = [
  {
    name: "Standard",
    minDeckSize: 60,
    maxDeckSize: null,
    maxCopies: 4,
    allowedSets: ["snc", "mom", "woe", "lci"],
    sideboardSize: 15,
  },
  {
    name: "Modern",
    minDeckSize: 60,
    maxDeckSize: null,
    maxCopies: 4,
    allowedSets: ["8ed", "mrd"], // Just example set codes
    sideboardSize: 15,
  },
];

export async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    console.log("Clearing existing data...");
    await Format.deleteMany({});
    await Deck.deleteMany({});
    await User.deleteMany({});

    // Seed users
    console.log("Seeding users...");
    const users = await User.insertMany(SAMPLE_USERS);
    console.log(`Seeded ${users.length} users`);

    // Seed formats
    console.log("Seeding formats...");
    const formats = await Format.insertMany(SAMPLE_FORMATS);
    console.log(`Seeded ${formats.length} formats`);

    // Seed decks
    console.log("Seeding decks...");
    const decks = await Deck.insertMany(SAMPLE_DECKS);
    console.log(`Seeded ${decks.length} decks`);

    // Update user stats
    console.log("Updating user stats...");
    for (const user of users) {
      await user.updateDeckStats();
    }

    console.log("Database seeded successfully!");

    // Log some sample queries
    const userDecks = await Deck.find({ "author.id": "user_1" });
    console.log(`Found ${userDecks.length} decks for SpikeMTG`);

    const publicDecks = await Deck.find({ isPublic: true });
    console.log(`Found ${publicDecks.length} public decks`);

    return { success: true };
  } catch (error) {
    console.error("Seeding failed:", error);
    return { success: false, error };
  }
}
