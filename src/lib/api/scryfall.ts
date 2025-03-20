import { Card } from "@/types/mtg";

const SCRYFALL_API_BASE = "https://api.scryfall.com";

interface ScryfallCard {
  id: string;
  name: string;
  image_uris?: {
    normal: string;
    small: string;
  };
  card_faces?: Array<{
    image_uris?: {
      normal: string;
      small: string;
    };
  }>;
  type_line: string;
  mana_cost: string;
  prints_search_uri?: string;
  set_name: string;
  collector_number: string;
  rarity: string;
}

interface ScryfallResponse {
  data: ScryfallCard[];
  has_more: boolean;
  total_cards: number;
}

const fetchAllPrintings = async (
  printsSearchUri: string
): Promise<ScryfallCard[]> => {
  try {
    const response = await fetch(printsSearchUri);
    if (!response.ok) {
      throw new Error("Failed to fetch card printings");
    }
    const data: ScryfallResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching card printings:", error);
    return [];
  }
};

export const searchCards = async (
  query: string,
  includeVariations = false
): Promise<ScryfallCard[]> => {
  try {
    // Initial search to get base cards
    const response = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
        query
      )}&include_extras=false&include_multilingual=false&include_variations=false`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return []; // No results found
      }
      throw new Error("Failed to fetch cards");
    }

    const data: ScryfallResponse = await response.json();

    if (!includeVariations) {
      return data.data;
    }

    // If includeVariations is true, fetch all printings for each unique card
    const allPrintings = await Promise.all(
      data.data.map(async (card) => {
        if (card.prints_search_uri) {
          const printings = await fetchAllPrintings(card.prints_search_uri);
          return printings;
        }
        return [card];
      })
    );

    // Flatten the array of arrays and remove duplicates by id
    const uniquePrintings = Array.from(
      new Map(allPrintings.flat().map((card) => [card.id, card])).values()
    );

    return uniquePrintings;
  } catch (error) {
    console.error("Error searching cards:", error);
    return [];
  }
};

export const getCardById = async (id: string): Promise<Card> => {
  const response = await fetch(`${SCRYFALL_API_BASE}/cards/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch card");
  }

  return response.json();
};

export const getRandomCard = async (): Promise<Card> => {
  const response = await fetch(`${SCRYFALL_API_BASE}/cards/random`);

  if (!response.ok) {
    throw new Error("Failed to fetch random card");
  }

  return response.json();
};
