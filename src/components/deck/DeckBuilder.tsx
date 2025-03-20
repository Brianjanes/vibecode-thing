"use client";

import { useState } from "react";

// Define types for our cards
interface CardData {
  id: string;
  name: string;
  column: number;
  location: "main" | "side";
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
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDraggingOver(false);
  };

  const containerHeight = type === "main" ? 500 : 300;
  const cardHeight = 60;
  const lastCardHeight = 215; // Full card height for last card
  const cardSpacing = 30;
  const title = type === "main" ? "Main Deck" : "Sideboard";
  const containerClass = type === "main" ? "w-2/3" : "w-1/3";
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
      className={`${containerClass} border p-2 bg-gray-50 flex flex-col`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={() => setIsDraggingOver(false)}
    >
      <h2 className="text-lg font-bold mb-2">
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
                <div className="text-xs font-semibold mb-1 text-center sticky top-0 bg-gray-50 z-50 py-1">
                  {type === "main" ? "Column" : "Side"} {columnIndex + 1}
                </div>
                <div className="relative">
                  {column.map((card, cardIndex) => {
                    const isLastCard = cardIndex === column.length - 1;
                    const cardTop = cardIndex * cardSpacing;
                    const thisCardHeight = isLastCard
                      ? lastCardHeight
                      : cardHeight;

                    return (
                      <div
                        key={card.id}
                        className={`absolute w-full bg-white border border-gray-300 p-1 rounded cursor-move hover:bg-blue-50 transition-transform hover:translate-y-1 cursor-grab ${
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
                        <div className="truncate text-sm">{card.name}</div>
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
            <div className="text-xs font-semibold mb-1 text-center sticky top-0 bg-gray-50 z-50 py-1">
              New Column
            </div>
            <div
              className={`h-[${containerHeight}px] border-2 border-dashed border-blue-300 rounded-md bg-blue-50 flex items-center justify-center`}
            >
              <p className="text-blue-500 text-sm">
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
  const [mainDeckColumns, setMainDeckColumns] = useState<CardData[][]>(
    Array.from({ length: 6 }, (_, columnIndex) =>
      Array.from({ length: 10 }, (_, cardIndex) => ({
        id: `main-${columnIndex}-${cardIndex}`,
        name: `Card ${columnIndex}-${cardIndex}`,
        column: columnIndex,
        location: "main" as const,
      }))
    )
  );
  const [sideboardColumns, setSideboardColumns] = useState<CardData[][]>(
    Array.from({ length: 3 }, (_, columnIndex) =>
      Array.from({ length: 5 }, (_, cardIndex) => ({
        id: `side-${columnIndex}-${cardIndex}`,
        name: `Side ${columnIndex}-${cardIndex}`,
        column: columnIndex,
        location: "side" as const,
      }))
    )
  );

  const handleCardMove = (
    card: CardData,
    targetLocation: "main" | "side",
    targetColumn: number
  ) => {
    // Remove from source
    if (card.location === "main") {
      setMainDeckColumns((prev) =>
        prev.map((col, colIndex) =>
          colIndex === card.column ? col.filter((c) => c.id !== card.id) : col
        )
      );
    } else {
      setSideboardColumns((prev) =>
        prev.map((col, colIndex) =>
          colIndex === card.column ? col.filter((c) => c.id !== card.id) : col
        )
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
      targetColumn >= prev.length
        ? [...prev, [updatedCard]]
        : prev.map((col, colIndex) =>
            colIndex === targetColumn ? [...col, updatedCard] : col
          )
    );

    // Scroll if new column
    if (
      targetColumn >=
      (targetLocation === "main" ? mainDeckColumns : sideboardColumns).length
    ) {
      setTimeout(() => {
        const container = document.getElementById(
          `${targetLocation}-scroll-container`
        );
        container?.scrollTo({
          left: container.scrollWidth,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <div className="w-full bg-white min-h-[600px] p-4 border border-gray-300 rounded-lg">
      <div className="flex h-full">
        <DeckSection
          type="main"
          columns={mainDeckColumns}
          onDragStart={setDraggedCard}
          onColumnDrop={(targetColumn) =>
            draggedCard && handleCardMove(draggedCard, "main", targetColumn)
          }
          onCreateColumn={() =>
            draggedCard &&
            handleCardMove(draggedCard, "main", mainDeckColumns.length)
          }
        />
        <DeckSection
          type="side"
          columns={sideboardColumns}
          onDragStart={setDraggedCard}
          onColumnDrop={(targetColumn) =>
            draggedCard && handleCardMove(draggedCard, "side", targetColumn)
          }
          onCreateColumn={() =>
            draggedCard &&
            handleCardMove(draggedCard, "side", sideboardColumns.length)
          }
        />
      </div>
    </div>
  );
};
