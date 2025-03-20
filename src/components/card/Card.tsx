"use client";

import { Card as CardType } from "@/types/mtg";
import { useState } from "react";

interface CardProps {
  card: CardType;
  quantity?: number;
  onRemove?: () => void;
  draggable?: boolean;
  size?: "small" | "medium" | "large";
}

export const Card = ({
  card,
  quantity = 1,
  onRemove,
  draggable = true,
  size = "small",
}: CardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle drag start to enable drag and drop functionality
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggable) return;
    e.dataTransfer.setData("application/json", JSON.stringify(card));
    e.dataTransfer.effectAllowed = "copy";
  };

  // Determine image URL based on card data
  const imageUrl =
    card.image_uris?.small ||
    (card.card_faces && card.card_faces[0]?.image_uris?.small) ||
    "https://c2.scryfall.com/file/scryfall-cards/small/front/0/c/0c082aa8-bf7f-47f2-baf8-43ad253fd7d7.jpg?1562826021"; // Placeholder image

  // Calculate size dimensions
  const sizeMap = {
    small: {
      width: "w-[146px]",
      height: "h-[204px]",
      fontSize: "text-xs",
      quantitySize: "text-xs",
      removeButtonSize: "w-5 h-5 text-xs",
      cornerRadius: "rounded",
    },
    medium: {
      width: "w-[200px]",
      height: "h-[280px]",
      fontSize: "text-sm",
      quantitySize: "text-sm",
      removeButtonSize: "w-6 h-6 text-sm",
      cornerRadius: "rounded-md",
    },
    large: {
      width: "w-[280px]",
      height: "h-[392px]",
      fontSize: "text-base",
      quantitySize: "text-base",
      removeButtonSize: "w-7 h-7 text-base",
      cornerRadius: "rounded-lg",
    },
  };

  const {
    width,
    height,
    fontSize,
    quantitySize,
    removeButtonSize,
    cornerRadius,
  } = sizeMap[size];

  return (
    <div
      className={`relative ${width} ${height} group ${
        draggable ? "cursor-move" : ""
      }`}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      {/* Card image */}
      <div
        className={`relative ${width} ${height} bg-gray-200 overflow-hidden ${cornerRadius}`}
      >
        <img
          src={imageUrl}
          alt={card.name}
          className={`w-full h-full object-cover ${
            isLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-200`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />

        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-pulse w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        )}

        {/* Card name overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-2 py-1 transform translate-y-full group-hover:translate-y-0 transition-transform">
          <p className={`truncate ${fontSize}`}>{card.name}</p>
          <p className={`truncate ${fontSize} text-gray-300`}>
            {card.type_line}
          </p>
        </div>

        {/* Quantity indicator */}
        {quantity > 0 && (
          <div className="absolute top-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded-full">
            <span className={quantitySize}>{quantity}×</span>
          </div>
        )}

        {/* Remove button */}
        {onRemove && (
          <button
            onClick={onRemove}
            className={`absolute top-1 right-1 bg-red-500 text-white ${removeButtonSize} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
            title="Remove card"
          >
            ×
          </button>
        )}

        {/* Hover effect */}
        <div
          className={`absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors ${cornerRadius}`}
        />
      </div>
    </div>
  );
};
