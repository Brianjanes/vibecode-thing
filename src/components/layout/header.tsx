"use client";

import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "../theme-toggle";
import { usePathname } from "next/navigation";

const pageMetadata = {
  "/dashboard": {
    title: "Dashboard",
    description: "Welcome to your MTG Deck Builder dashboard",
  },
  "/deck-builder": {
    title: "Deck Builder",
    description: "Create and customize your Magic: The Gathering deck",
  },
  "/my-decks": {
    title: "My Decks",
    description: "View and manage your Magic: The Gathering decks",
  },
};

export function Header() {
  const pathname = usePathname();
  const metadata = pageMetadata[pathname as keyof typeof pageMetadata] || {
    title: "MTG Deck Builder",
    description: "Build better Magic: The Gathering decks",
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h2 className="text-lg font-semibold">{metadata.title}</h2>
            <p className="text-sm text-muted-foreground">
              {metadata.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mr-4">
          <ThemeToggle />
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
