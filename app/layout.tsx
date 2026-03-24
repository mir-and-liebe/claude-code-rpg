import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ProgressProvider } from "@/lib/use-progress";
import { XPToast } from "@/components/XPToast";
import { NarrativeModal } from "@/components/NarrativeModal";
import { ChallengeGate } from "@/components/ChallengeGate";
import { ReferenceDrawer } from "@/components/ReferenceDrawer";
import { WelcomeFlow } from "@/components/WelcomeFlow";

export const metadata: Metadata = {
  title: "CC RPG — Vibecoder Mastery Dashboard",
  description:
    "RPG-style skill tracker for mastering Claude Code vibecoding",
  openGraph: {
    title: "CC RPG — Vibecoder Mastery Dashboard",
    description:
      "RPG-style skill tracker for mastering Claude Code. 6 skill trees, tiered badges, daily quests, and the Octalysis gamification framework.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CC RPG — Vibecoder Mastery Dashboard",
    description:
      "RPG-style skill tracker for mastering Claude Code vibecoding",
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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-60 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-bg focus:rounded-lg">
          Skip to content
        </a>
        <ProgressProvider>
          <Sidebar />
          <main id="main-content" className="md:ml-56 min-h-screen p-4 pt-16 md:p-8">{children}</main>
          <XPToast />
          <NarrativeModal />
          <ChallengeGate />
          <ReferenceDrawer />
          <WelcomeFlow />
        </ProgressProvider>
      </body>
    </html>
  );
}
