"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Deck Builder",
    href: "/deck-builder",
    icon: Plus,
  },
  {
    name: "My Decks",
    href: "/my-decks",
    icon: Library,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  return (
    <div className="w-[240px] border-r border-border bg-card">
      {/* Static Header */}
      <div className="h-[57px] flex items-center border-b border-border px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M16 2L2 8L16 14L30 8L16 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 16L16 22L30 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 24L16 30L30 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-primary">MTG</span>
          <span className="text-muted-foreground">Deck Builder</span>
        </Link>
      </div>

      {/* Scrollable Navigation */}
      <div className="h-[calc(100vh-57px)] flex flex-col justify-between overflow-y-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-accent text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="w-9/10 flex items-center justify-evenly mt-auto p-1">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
          <p className="text-sm text-muted-foreground">
            {user?.emailAddresses[0].emailAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
