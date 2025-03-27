"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { searchCards } from "@/lib/api/scryfall";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { SearchResults } from "./SearchResults";
import { cn } from "@/lib/utils";

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
    <div className="w-full glass-effect glass-border with-glow rounded-lg p-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <form onSubmit={handleSearch} className="flex-1 flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for cards..."
                className="w-full pl-10 pr-4 py-2 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                disabled={isLoading}
                className={cn(
                  "absolute left-0 inset-y-0 px-2 flex items-center text-muted-foreground transition-colors",
                  isLoading && "animate-pulse"
                )}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Search
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
              className="text-sm text-muted-foreground whitespace-nowrap"
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
    </div>
  );
};
