"use client";

import { useState, useEffect } from "react";
import { searchCards } from "@/lib/api/scryfall";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
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
  set_name: string;
  collector_number: string;
  rarity: string;
}

interface SearchBarProps {
  onCardSelected: (card: SearchResult) => void;
}

export const SearchBar = ({ onCardSelected }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllVersions, setShowAllVersions] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchCards(searchTerm, showAllVersions);
      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search when debounced search term changes or showAllVersions changes
  useEffect(() => {
    handleSearch();
  }, [debouncedSearch, showAllVersions]);

  const getCardImage = (card: SearchResult) => {
    if (card.image_uris?.small) {
      return card.image_uris.small;
    }
    if (card.card_faces?.[0]?.image_uris?.small) {
      return card.card_faces[0].image_uris.small;
    }
    return null;
  };

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
    <div className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">MTG Deck Builder</h1>
        <p className="text-sm text-gray-600">
          Build and manage your Magic: The Gathering decks
        </p>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <form onSubmit={handleSearch} className="flex-1 flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for cards..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAllVersions"
            checked={showAllVersions}
            onChange={(e) => setShowAllVersions(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="showAllVersions" className="text-sm text-gray-700">
            Show all versions
          </label>
        </div>
      </div>

      {/* Results Area */}
      <div className="h-[400px] overflow-y-auto border border-gray-200 rounded-md bg-white p-4 mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {searchTerm ? "No cards found" : "Start typing to search for cards"}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedResults).map(([name, cards]) => (
              <div key={name} className="space-y-2">
                {showAllVersions && name && (
                  <h3 className="text-sm font-medium text-gray-700">{name}</h3>
                )}
                <div className="flex flex-wrap gap-4">
                  {cards.map((card) => {
                    const imageUrl = getCardImage(card);
                    return (
                      <div
                        key={card.id}
                        onClick={() => onCardSelected(card)}
                        className="relative group"
                      >
                        <div className="w-[150px] h-[215px] bg-gray-100 border border-gray-300 rounded cursor-pointer hover:border-blue-500 transition-colors overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={card.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-2">
                              <span className="text-sm text-center">
                                {card.name}
                              </span>
                            </div>
                          )}
                        </div>
                        {showAllVersions && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {card.set_name} #{card.collector_number}
                            <br />
                            {card.rarity.charAt(0).toUpperCase() +
                              card.rarity.slice(1)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
