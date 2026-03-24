"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Swords,
  TreePine,
  BookOpen,
  BarChart3,
  Vault,
  UserCog,
  Menu,
  X,
  Map,
  TerminalSquare,
  Brain,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", Icon: Swords },
  { href: "/skills", label: "Skill Trees", Icon: TreePine },
  { href: "/map", label: "Map", Icon: Map },
  { href: "/playground", label: "Playground", Icon: TerminalSquare },
  { href: "/review", label: "Review", Icon: Brain },
  { href: "/bestpractices", label: "Best Practices", Icon: BookOpen },
  { href: "/progress", label: "Progress", Icon: BarChart3 },
  { href: "/character", label: "Character", Icon: UserCog },
  { href: "/vault", label: "Vault", Icon: Vault },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-surface border border-border cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-text" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-bg/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-56 bg-surface border-r border-border flex flex-col z-50 transition-transform duration-300",
          "md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="px-5 py-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-xl tracking-tight text-text">CC RPG</h1>
            <p className="text-xs text-text-muted mt-1 tracking-wide uppercase">
              Vibecoder Mastery
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1 cursor-pointer text-text-muted hover:text-text"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 cursor-pointer",
                (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)))
                  ? "bg-surface-hover text-text"
                  : "text-text-muted hover:text-text-secondary hover:bg-surface-hover/50"
              )}
            >
              <item.Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors duration-300",
                  (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) ? "text-gold" : ""
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
    </>
  );
}
