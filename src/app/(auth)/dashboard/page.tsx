import { auth } from "@clerk/nextjs/server";

interface Deck {
  id: string;
  name: string;
  format: string;
  colors: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

// This would typically come from your database
const MOCK_DECKS: Deck[] = [
  {
    id: "1",
    name: "Mono Red Aggro",
    format: "Standard",
    colors: ["R"],
    createdAt: "2024-03-23T12:00:00Z",
    updatedAt: "2024-03-23T12:00:00Z",
    isPublic: true,
  },
  {
    id: "2",
    name: "Esper Control",
    format: "Modern",
    colors: ["W", "U", "B"],
    createdAt: "2024-03-22T12:00:00Z",
    updatedAt: "2024-03-22T12:00:00Z",
    isPublic: true,
  },
];

export default async function DashboardPage() {
  await auth(); // Just check if user is authenticated

  return (
    <div className="space-y-6 mx-6 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <a
          href="/deck-builder"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Deck
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_DECKS.map((deck) => (
          <div
            key={deck.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{deck.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {deck.format}
                </p>
              </div>
              <div className="flex gap-1">
                {deck.colors.map((color) => (
                  <span
                    key={color}
                    className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-sm font-medium"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>
                Updated{" "}
                {new Date(deck.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {deck.isPublic ? (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Public
                </span>
              ) : (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z"
                    />
                  </svg>
                  Private
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
