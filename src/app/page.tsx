"use client";

import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SignedIn>
        {/* Redirect authenticated users to dashboard */}
        {redirect("/dashboard")}
      </SignedIn>

      <SignedOut>
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Build Better MTG Decks
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              Create, share, and analyze your Magic: The Gathering decks with
              our powerful deck building tools.
            </p>
            <div className="flex gap-4">
              <SignUpButton mode="modal">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Get Started
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced Search",
                description:
                  "Find the perfect cards for your deck with our powerful search tools.",
                icon: (
                  <svg
                    className="w-6 h-6 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                ),
              },
              {
                title: "Deck Analysis",
                description:
                  "Get insights into your mana curve, color distribution, and more.",
                icon: (
                  <svg
                    className="w-6 h-6 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
              },
              {
                title: "Share & Collaborate",
                description:
                  "Share your decks with the community and get valuable feedback.",
                icon: (
                  <svg
                    className="w-6 h-6 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SignedOut>
    </main>
  );
}
