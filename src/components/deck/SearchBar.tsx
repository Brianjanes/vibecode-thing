"use client";

import { useState, useEffect } from "react";
import { searchCards } from "@/lib/api/scryfall";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { SearchResults } from "./SearchResults";

export interface SearchResult {
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
  onAddToMaindeck: (card: SearchResult) => void;
  onAddToSideboard: (card: SearchResult) => void;
}

export const SearchBar = ({
  onAddToMaindeck,
  onAddToSideboard,
}: SearchBarProps) => {
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

  return (
    <div className="w-full bg-card border border-border rounded-lg p-4">
      <div className="flex gap-4 items-center flex-wrap">
        <form onSubmit={handleSearch} className="flex-1 flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for cards..."
            className="flex-1 p-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
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
            className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
          />
          <label
            htmlFor="showAllVersions"
            className="text-sm text-muted-foreground"
          >
            Show all versions
          </label>
        </div>
      </div>

      <SearchResults
        results={results}
        isLoading={isLoading}
        searchTerm={searchTerm}
        showAllVersions={showAllVersions}
        onAddToMaindeck={onAddToMaindeck}
        onAddToSideboard={onAddToSideboard}
      />
    </div>
  );
};
