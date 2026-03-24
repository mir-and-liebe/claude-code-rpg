"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Swords, TreePine, BookOpen, BarChart3, Vault } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", Icon: Swords },
  { href: "/skills", label: "Skill Trees", Icon: TreePine },
  { href: "/bestpractices", label: "Best Practices", Icon: BookOpen },
  { href: "/progress", label: "Progress", Icon: BarChart3 },
  { href: "/vault", label: "Vault", Icon: Vault },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-surface border-r border-border flex flex-col z-50">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold text-accent neon-text-green tracking-tight">
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
              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer",
              pathname === item.href
                ? "bg-accent/10 text-accent border border-accent/20 glow-accent"
                : "text-text-muted hover:bg-surface-hover hover:text-text border border-transparent"
            )}
          >
            <item.Icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <p className="text-[10px] text-text-muted text-center font-mono">
          ECC + BMAD + UI/UX Pro
        </p>
      </div>
    </aside>
  );
}
