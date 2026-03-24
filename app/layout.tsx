import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ProgressProvider } from "@/lib/use-progress";

export const metadata: Metadata = {
  title: "CC RPG — Vibecoder Mastery Dashboard",
  description:
    "RPG-style skill tracker for mastering Claude Code vibecoding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ProgressProvider>
          <Sidebar />
          <main className="ml-56 min-h-screen p-8">{children}</main>
        </ProgressProvider>
      </body>
    </html>
  );
}
