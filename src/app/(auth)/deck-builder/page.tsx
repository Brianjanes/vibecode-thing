import { DeckBuilder } from "@/components/deck/DeckBuilder";

export default function DeckBuilderPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Deck Builder</h1>
        <p className="text-muted-foreground mt-2">
          Create and customize your Magic: The Gathering deck
        </p>
      </div>
      <DeckBuilder />
    </>
  );
}
