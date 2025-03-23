"use client";

import { type SearchResult } from "./SearchBar";
import { Card } from "../card/Card";

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  searchTerm: string;
  showAllVersions: boolean;
  onAddToMaindeck: (card: SearchResult) => void;
  onAddToSideboard: (card: SearchResult) => void;
}

export const SearchResults = ({
  results,
  isLoading,
  searchTerm,
  showAllVersions,
  onAddToMaindeck,
  onAddToSideboard,
}: SearchResultsProps) => {
  // Group cards by name when showing all versions
  const groupedResults = showAllVersions
    ? results.reduce((acc, card) => {
        if (!acc[card.name]) {
          acc[card.name] = [];
        }
        acc[card.name].push(card);
        return acc;
      }, {} as Record<string, SearchResult[]>)
    : { "": results };

  return (
    <div className="h-[300px] overflow-y-auto border border-border rounded-md bg-transparent p-4 mt-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : results.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {searchTerm ? "No cards found" : "Start typing to search for cards"}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedResults).map(([name, cards]) => (
            <div key={name} className="space-y-2">
              {showAllVersions && name && (
                <h3 className="text-sm font-medium text-foreground">{name}</h3>
              )}
              <div className="flex flex-wrap gap-4">
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    onAddToMaindeck={() => onAddToMaindeck(card)}
                    onAddToSideboard={() => onAddToSideboard(card)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
