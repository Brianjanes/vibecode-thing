"use client";

import { useState } from "react";

interface CardData {
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
  type_line?: string;
  set_name?: string;
  collector_number?: string;
  rarity?: string;
}

interface CardProps {
  card: CardData;
  onAddToMaindeck?: () => void;
  onAddToSideboard?: () => void;
  quantity?: number;
  onRemove?: () => void;
  draggable?: boolean;
  showDetails?: boolean;
}

export const Card = ({
  card,
  onAddToMaindeck,
  onAddToSideboard,
  quantity,
  onRemove,
  draggable = false,
  showDetails = true,
}: CardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggable) return;
    e.dataTransfer.setData("application/json", JSON.stringify(card));
    e.dataTransfer.effectAllowed = "copy";
  };

  const imageUrl =
    card.image_uris?.small ||
    (card.card_faces && card.card_faces[0]?.image_uris?.small) ||
    "https://c2.scryfall.com/file/scryfall-cards/small/front/0/c/0c082aa8-bf7f-47f2-baf8-43ad253fd7d7.jpg?1562826021";

  return (
    <div
      className="relative w-[146px] h-[204px] group"
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className="relative w-full h-full bg-gray-200 overflow-hidden rounded">
        <img
          src={imageUrl}
          alt={card.name}
          className={`w-full h-full object-cover ${
            isLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-200`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-pulse w-10 h-10 bg-gray-300 rounded-full" />
          </div>
        )}

        {showDetails && (
          <>
            {/* Card name and type */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-2 py-1 transform translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="truncate text-xs">{card.name}</p>
              {card.type_line && (
                <p className="truncate text-xs text-gray-300">
                  {card.type_line}
                </p>
              )}
            </div>

            {/* Add to deck buttons */}
            {(onAddToMaindeck || onAddToSideboard) && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center gap-1">
                {onAddToMaindeck && (
                  <button
                    onClick={onAddToMaindeck}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-xs py-1 px-2 rounded"
                  >
                    Main
                  </button>
                )}
                {onAddToSideboard && (
                  <button
                    onClick={onAddToSideboard}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-xs py-1 px-2 rounded"
                  >
                    Side
                  </button>
                )}
              </div>
            )}

            {/* Set info */}
            {card.set_name && (
              <div className="absolute bottom-[32px] left-0 right-0 bg-black/75 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {card.set_name} #{card.collector_number}
                <br />
                {card.rarity &&
                  card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
              </div>
            )}
          </>
        )}

        {/* Quantity badge */}
        {quantity && (
          <div className="absolute top-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded-full">
            <span className="text-xs">{quantity}×</span>
          </div>
        )}

        {/* Remove button */}
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove card"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
