"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: "⚔️" },
  { href: "/skills", label: "Skill Trees", icon: "🌳" },
  { href: "/bestpractices", label: "Best Practices", icon: "📖" },
  { href: "/progress", label: "Progress", icon: "📊" },
  { href: "/vault", label: "Vault", icon: "🏛️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-surface border-r border-border flex flex-col z-50">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold text-accent-glow tracking-tight">
          CC RPG
        </h1>
        <p className="text-xs text-text-muted mt-0.5">Vibecoder Mastery</p>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-accent/20 text-accent-glow"
                : "text-text-muted hover:bg-surface-hover hover:text-text"
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <p className="text-[10px] text-text-muted text-center">
          ECC + BMAD powered
        </p>
      </div>
    </aside>
  );
}
