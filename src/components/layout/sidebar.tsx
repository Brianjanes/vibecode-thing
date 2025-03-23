"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Library } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="w-[240px] border-r border-border bg-card">
      {/* Static Header */}
      <div className="h-[57px] flex items-center border-b border-border px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
        >
          <span className="text-primary">MTG</span>
          <span className="text-muted-foreground">Deck Builder</span>
        </Link>
      </div>

      {/* Scrollable Navigation */}
      <div className="h-[calc(100vh-57px)] overflow-y-auto py-2">
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
      </div>
    </div>
  );
}
