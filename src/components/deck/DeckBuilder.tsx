"use client";

import { useState } from "react";
import Image from "next/image";
import { SearchBar } from "./SearchBar";
import type { SearchResult } from "./SearchBar";

// Define types for our cards
interface CardData {
  id: string;
  name: string;
  column: number;
  location: "main" | "side";
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
}

interface DeckSectionProps {
  type: "main" | "side";
  columns: CardData[][];
  onColumnDrop: (targetColumn: number) => void;
  onCreateColumn: () => void;
  onDragStart: (card: CardData) => void;
}

const DeckSection = ({
  type,
  columns,
  onColumnDrop,
  onCreateColumn,
  onDragStart,
}: DeckSectionProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const getCardImage = (card: CardData) => {
    if (card.image_uris?.small) {
      return card.image_uris.small;
    }
    if (card.card_faces?.[0]?.image_uris?.small) {
      return card.card_faces[0].image_uris.small;
    }
    return null;
  };

  const containerHeight = type === "main" ? 500 : 300;
  const cardHeight = 60;
  const lastCardHeight = cardHeight;
  const cardSpacing = 30;
  const title = type === "main" ? "Main Deck" : "Sideboard";
  const containerClass = type === "main" ? "w-full" : "w-full";
  const scrollContainerId = `${type}-scroll-container`;
  const defaultColumns = type === "main" ? 6 : 3;

  // Calculate if we need horizontal scrolling based on column count or drag state
  const needsHorizontalScroll =
    columns.length > defaultColumns || isDraggingOver;

  // Calculate if we need vertical scrolling based on card count in the tallest column
  const maxCardsInColumn = Math.max(...columns.map((col) => col.length));
  const totalContentHeight =
    (maxCardsInColumn - 1) * cardSpacing + lastCardHeight;
  const needsVerticalScroll = totalContentHeight > containerHeight;

  return (
    <div
      className={`${containerClass} border border-border p-4 bg-background rounded-lg`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={() => setIsDraggingOver(false)}
    >
      <h2 className="text-lg font-bold mb-4 text-foreground">
        {title} ({columns.flat().length} cards)
      </h2>
      <div className="min-w-full flex-1 relative">
        <div
          id={scrollContainerId}
          className={`h-[${containerHeight}px] flex 
            ${needsHorizontalScroll ? "overflow-x-auto" : "overflow-x-hidden"}
            ${needsVerticalScroll ? "overflow-y-auto" : "overflow-y-hidden"}
            pb-2 scroll-smooth relative`}
        >
          <div
            className={`flex min-w-full ${
              needsHorizontalScroll ? "" : "flex-1"
            }`}
          >
            {columns.map((column, columnIndex) => (
              <div
                key={`${type}-column-${columnIndex}`}
                className={`${
                  needsHorizontalScroll
                    ? "w-[150px] flex-none"
                    : "flex-1 min-w-[150px]"
                } px-1`}
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  e.preventDefault();
                  onColumnDrop(columnIndex);
                  setIsDraggingOver(false);
                }}
              >
                <div className="text-xs font-semibold mb-1 text-center sticky top-0 bg-background z-50 py-1">
                  &nbsp;
                </div>
                <div className="relative">
                  {column.map((card, cardIndex) => {
                    const imageUrl = getCardImage(card);
                    const isLastCard = cardIndex === column.length - 1;
                    const cardTop = cardIndex * cardSpacing;
                    const thisCardHeight = isLastCard
                      ? lastCardHeight
                      : cardHeight;

                    return (
                      <div
                        key={card.id}
                        className={`absolute w-full h-auto cursor-move hover:bg-accent transition-transform hover:translate-y-1 cursor-grab ${
                          isLastCard ? "z-50" : ""
                        }`}
                        style={{
                          top: `${cardTop}px`,
                          zIndex: isLastCard ? 100 : cardIndex,
                          height: `${thisCardHeight}px`,
                        }}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", card.id);
                          onDragStart(card);
                        }}
                      >
                        <div className="truncate text-sm text-foreground">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={card.name}
                              width={146}
                              height={204}
                              className={`w-full h-full object-cover ${
                                !isLastCard && "opacity-100"
                              }`}
                            />
                          ) : (
                            card.name
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div
                    style={{
                      height: `${Math.max(
                        (column.length - 1) * cardSpacing + lastCardHeight,
                        containerHeight
                      )}px`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* New Column Drop Area - Only visible during drag */}
          <div
            className={`w-[150px] flex-none px-1 transition-opacity duration-200 ${
              isDraggingOver ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => {
              e.preventDefault();
              onCreateColumn();
              setIsDraggingOver(false);
            }}
          >
            <div className="text-xs font-semibold mb-1 text-center sticky top-0 bg-background z-50 py-1">
              New Column
            </div>
            <div
              className={`h-[${containerHeight}px] border-2 border-dashed border-primary rounded-md bg-accent/50 flex items-center justify-center`}
            >
              <p className="text-primary text-sm">
                Drop here to create new column
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeckBuilder = () => {
  const [draggedCard, setDraggedCard] = useState<CardData | null>(null);
  // Initialize with 8 empty columns for main deck and 4 for sideboard
  const [mainDeckColumns, setMainDeckColumns] = useState<CardData[][]>(
    Array(8)
      .fill(null)
      .map(() => [])
  );
  const [sideboardColumns, setSideboardColumns] = useState<CardData[][]>(
    Array(4)
      .fill(null)
      .map(() => [])
  );

  const handleAddToMaindeck = (card: SearchResult) => {
    const newCard: CardData = {
      id: `${card.id}-${Date.now()}`, // Make ID unique
      name: card.name,
      column: 0,
      location: "main",
      image_uris: card.image_uris,
      card_faces: card.card_faces,
    };

    setMainDeckColumns((prev) => {
      // Find first column with space
      const targetColumnIndex = prev.findIndex((col) => col.length < 10);
      if (targetColumnIndex === -1) return prev;

      return prev.map((col, idx) =>
        idx === targetColumnIndex ? [...col, newCard] : col
      );
    });
  };

  const handleAddToSideboard = (card: SearchResult) => {
    const newCard: CardData = {
      id: `${card.id}-${Date.now()}`, // Make ID unique
      name: card.name,
      column: 0,
      location: "side",
      image_uris: card.image_uris,
      card_faces: card.card_faces,
    };

    setSideboardColumns((prev) => {
      const targetColumnIndex = prev.findIndex((col) => col.length < 10);
      if (targetColumnIndex === -1) return prev;

      return prev.map((col, idx) =>
        idx === targetColumnIndex ? [...col, newCard] : col
      );
    });
  };

  const handleCardMove = (
    card: CardData,
    targetLocation: "main" | "side",
    targetColumn: number
  ) => {
    // Remove from source
    if (card.location === "main") {
      setMainDeckColumns((prev) =>
        prev.map((col) => col.filter((c) => c.id !== card.id))
      );
    } else {
      setSideboardColumns((prev) =>
        prev.map((col) => col.filter((c) => c.id !== card.id))
      );
    }

    // Add to target
    const updatedCard = {
      ...card,
      column: targetColumn,
      location: targetLocation,
    };
    const setColumns =
      targetLocation === "main" ? setMainDeckColumns : setSideboardColumns;

    setColumns((prev) =>
      prev.map((col, idx) =>
        idx === targetColumn ? [...col, updatedCard] : col
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        onAddToMaindeck={handleAddToMaindeck}
        onAddToSideboard={handleAddToSideboard}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-[2] min-w-0">
          <DeckSection
            type="main"
            columns={mainDeckColumns}
            onColumnDrop={(targetColumn) => {
              if (draggedCard)
                handleCardMove(draggedCard, "main", targetColumn);
            }}
            onCreateColumn={() => {}}
            onDragStart={setDraggedCard}
          />
        </div>
        <div className="flex-1 min-w-0">
          <DeckSection
            type="side"
            columns={sideboardColumns}
            onColumnDrop={(targetColumn) => {
              if (draggedCard)
                handleCardMove(draggedCard, "side", targetColumn);
            }}
            onCreateColumn={() => {}}
            onDragStart={setDraggedCard}
          />
        </div>
      </div>
    </div>
  );
};
