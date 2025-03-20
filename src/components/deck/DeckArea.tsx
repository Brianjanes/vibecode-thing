"use client";

import { Card, DeckCard } from "@/types/mtg";

interface DeckAreaProps {
  cards: DeckCard[];
  onRemoveCard: (cardId: string) => void;
  onCardDrop: (card: Card, destination: "main" | "side") => void;
}

export const DeckArea = ({
  cards,
  onRemoveCard,
  onCardDrop,
}: DeckAreaProps) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const card = JSON.parse(e.dataTransfer.getData("application/json"));
      const dropTarget = e.currentTarget;
      if (dropTarget.getAttribute("data-deck-area") === "main") {
        onCardDrop(card, "main");
      }
    } catch (error) {
      console.error("Failed to process dropped card:", error);
    }
  };

  // Group cards by mana value (CMC)
  const cardsByCmc: Record<number, DeckCard[]> = {};

  // Initialize columns for CMC 0-8+
  for (let i = 0; i <= 8; i++) {
    cardsByCmc[i] = [];
  }

  // Sort cards into CMC columns
  cards.forEach((card) => {
    const cmc = Math.min(Math.floor(card.cmc || 0), 8); // Group 8+ CMC together
    cardsByCmc[cmc].push(card);
  });

  // Sort cards within each CMC by name
  Object.values(cardsByCmc).forEach((cmcCards) => {
    cmcCards.sort((a, b) => a.name.localeCompare(b.name));
  });

  const cardCount = cards.reduce((sum, card) => sum + card.quantity, 0);

  // Create empty slots to fill the deck to 60 cards
  const emptySlotsNeeded = Math.max(0, 60 - cardCount);

  return (
    <div
      className="bg-white border border-gray-300 p-2"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-deck-area="main"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Main Deck</h2>
        <span className="text-sm">{cardCount} / 60 cards</span>
      </div>

      <div className="flex">
        {/* Render each CMC column */}
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="flex-1 min-w-0">
            <div className="text-xs font-bold text-center mb-1">
              {i === 8 ? "8+" : i}
            </div>
            <div className="flex flex-col gap-1">
              {/* Render cards in this column */}
              {cardsByCmc[i].map((card) => (
                <div key={card.id} className="relative">
                  <div className="w-full h-[125px] bg-gray-100 border border-gray-200 relative">
                    {card.image_uris?.small && (
                      <img
                        src={card.image_uris.small}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-0 left-0 bg-black/70 text-white px-1 text-xs">
                      {card.quantity}x
                    </div>
                    <button
                      onClick={() => onRemoveCard(card.id)}
                      className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              {/* Add empty slots if needed */}
              {i === 0 &&
                emptySlotsNeeded > 0 &&
                Array.from({ length: emptySlotsNeeded }, (_, j) => (
                  <div
                    key={`empty-${j}`}
                    className="w-full h-[125px] bg-gray-50 border border-dashed border-gray-200"
                  ></div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
