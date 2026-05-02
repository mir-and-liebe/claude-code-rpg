"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  ChartNoAxesColumnIncreasing,
  Map,
  RadioTower,
  Sparkles,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Run", Icon: RadioTower },
  { href: "/quests", label: "Campaign", Icon: Map },
  { href: "/skills", label: "Arsenal", Icon: Trophy },
  { href: "/anki", label: "Deck", Icon: Brain },
  { href: "/vault", label: "Codex", Icon: BookOpen },
  { href: "/progress", label: "Log", Icon: ChartNoAxesColumnIncreasing },
];

export function GameShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-void/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-signal/40 bg-signal/10">
              <Sparkles className="h-5 w-5 text-signal" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-wide text-ink">
                Vibecoding RPG
              </p>
              <p className="truncate text-[11px] uppercase tracking-[0.24em] text-muted">
                Solo Shipping Mastery
              </p>
            </div>
          </Link>

          <nav className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-medium transition",
                    active
                      ? "bg-panel-strong text-ink shadow-[inset_0_0_0_1px_var(--line-strong)]"
                      : "text-soft hover:bg-panel hover:text-ink"
                  )}
                >
                  <item.Icon className={cn("h-4 w-4", active && "text-signal")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="mx-auto flex max-w-7xl items-center justify-between px-4 pb-8 pt-2 text-[11px] uppercase tracking-[0.22em] text-muted sm:px-6 lg:px-8">
        <span>Discover</span>
        <span className="hidden sm:inline">Plan</span>
        <span>Build</span>
        <span className="hidden sm:inline">Test</span>
        <span>Ship</span>
        <span>Iterate</span>
      </footer>
    </div>
  );
}
