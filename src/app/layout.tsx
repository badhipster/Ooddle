import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Ooddle — Your AI-Powered Health Operating System",
  description: "Ooddle guides you daily across 5 core wellness pillars: metabolic health, movement, cognition, recovery, and supplements. Transform your health with AI-powered micro-actions.",
  keywords: "wellness, health, AI, metabolic, movement, cognition, recovery, supplements, longevity",
  openGraph: {
    title: "Ooddle — Your AI-Powered Health Operating System",
    description: "Transform your health with daily AI-guided micro-actions across 5 wellness pillars.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
