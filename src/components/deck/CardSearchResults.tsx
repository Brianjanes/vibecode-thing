"use client";

import { Card } from "@/types/mtg";

interface CardSearchResultsProps {
  cards: Card[];
  isLoading: boolean;
  showAllVersions?: boolean;
}

export const CardSearchResults = ({
  cards,
  isLoading,
  showAllVersions = false,
}: CardSearchResultsProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
    e.dataTransfer.setData("application/json", JSON.stringify(card));
    e.dataTransfer.effectAllowed = "copy";
  };

  // Group cards by CMC first
  const cardsByCmc: { [key: number]: Card[] } = {};

  // Initialize columns for CMC 0-8+
  for (let i = 0; i <= 8; i++) {
    cardsByCmc[i] = [];
  }

  // Group cards by name when showing all versions
  const processedCards = showAllVersions
    ? cards
    : cards.reduce((acc, card) => {
        // Keep only the first card with a given name
        const existingCardIndex = acc.findIndex((c) => c.name === card.name);
        if (existingCardIndex === -1) {
          acc.push(card);
        }
        return acc;
      }, [] as Card[]);

  // Sort cards into CMC columns
  processedCards.forEach((card) => {
    const cmc = Math.min(Math.floor(card.cmc || 0), 8);
    cardsByCmc[cmc].push(card);
  });

  // Sort cards within each CMC column by name
  Object.values(cardsByCmc).forEach((cmcGroup) => {
    cmcGroup.sort((a, b) => a.name.localeCompare(b.name));
  });

  return (
    <div className="border border-gray-300 bg-white h-full">
      <div className="p-2">
        <h2 className="text-lg font-bold mb-2">Search Results</h2>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : processedCards.length === 0 ? (
          <div className="text-center text-gray-600 p-4">
            No cards found. Try searching for something!
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {Object.entries(cardsByCmc).map(
              ([cmc, cmcCards]) =>
                cmcCards.length > 0 && (
                  <div key={cmc} className="mb-2">
                    <div className="text-xs font-bold mb-1">
                      CMC: {cmc === "8" ? "8+" : cmc}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cmcCards.map((card) => (
                        <div
                          key={card.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, card)}
                          className="w-[100px] h-[140px] bg-gray-100 border border-gray-200 relative hover:border-blue-500 cursor-move"
                        >
                          {card.image_uris?.small && (
                            <img
                              src={card.image_uris.small}
                              alt={card.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-1 py-0.5 text-[10px] truncate">
                            {card.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
