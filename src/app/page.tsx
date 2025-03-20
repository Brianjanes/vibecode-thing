"use client";

import { DeckBuilder } from "@/components/deck/DeckBuilder";
import { SearchBar } from "@/components/deck/SearchBar";

export default function Home() {
  const handleCardSelected = (card: { id: string; name: string }) => {
    // TODO: Add card to deck
    console.log("Selected card:", card);
  };

  return (
    <main className="container mx-auto p-4">
      <SearchBar onCardSelected={handleCardSelected} />
      <DeckBuilder />
    </main>
  );
}
