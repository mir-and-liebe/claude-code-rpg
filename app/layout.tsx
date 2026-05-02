import type { Metadata } from "next";
import "./globals.css";
import { GameShell } from "@/components/GameShell";
import { ProgressProvider } from "@/lib/use-progress";
import { XPToast } from "@/components/XPToast";
import { ChallengeGate } from "@/components/ChallengeGate";

export const metadata: Metadata = {
  title: "Vibecoding RPG — Solo Shipping Mastery",
  description:
    "RPG-style skill tracker for mastering AI-assisted solo product shipping",
  openGraph: {
    title: "Vibecoding RPG — Solo Shipping Mastery",
    description:
      "RPG-style skill tracker for mastering vibecoding. 6 skill trees, tiered badges, daily quests, and a solo shipping curriculum.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Vibecoding RPG — Solo Shipping Mastery",
    description:
      "RPG-style skill tracker for mastering AI-assisted solo product shipping",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-md bg-signal px-4 py-2 text-void">
          Skip to content
        </a>
        <ProgressProvider>
          <GameShell>{children}</GameShell>
          <XPToast />
          <ChallengeGate />
        </ProgressProvider>
      </body>
    </html>
  );
}
