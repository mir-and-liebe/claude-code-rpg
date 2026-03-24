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
      <div className="px-5 py-6 border-b border-border">
        <h1 className="text-xl tracking-tight text-text">CC RPG</h1>
        <p className="text-xs text-text-muted mt-1 tracking-wide uppercase">
          Vibecoder Mastery
        </p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 cursor-pointer",
              pathname === item.href
                ? "bg-surface-hover text-text"
                : "text-text-muted hover:text-text-secondary hover:bg-surface-hover/50"
            )}
          >
            <item.Icon
              className={cn(
                "w-4 h-4 shrink-0 transition-colors duration-300",
                pathname === item.href ? "text-gold" : ""
              )}
            />
            <span className="tracking-wide">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[10px] text-text-muted tracking-widest uppercase">
          ECC + BMAD
        </p>
      </div>
    </aside>
  );
}
