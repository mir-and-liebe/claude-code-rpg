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
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ProgressProvider>
          <Sidebar />
          <main className="ml-56 min-h-screen p-8">{children}</main>
        </ProgressProvider>
      </body>
    </html>
  );
}
