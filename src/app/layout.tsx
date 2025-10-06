import type { Metadata } from "next";
import { Geist, Geist_Mono, Arvo } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const arvo = Arvo({
  variable: "--font-arvo",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Farmatro",
  description:
    "Educational game teaching sustainable farming using real NASA satellite data for the 2025 NASA Space Apps Challenge. This project includes AI-generated content and was developed with AI assistance.",
  keywords: [
    "NASA",
    "Space Apps",
    "sustainable farming",
    "climate smart agriculture",
    "educational game",
    "AI generated content",
  ],
  authors: [{ name: "Agro Quest, NASA Space Apps 2025 Team" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${arvo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
