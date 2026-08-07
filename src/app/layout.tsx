import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HeriTech — Circular Digital System",
  description:
    "HeriTech intercepts festival waste before it becomes landfill, routes it to artisans, and gives every product a verifiable digital provenance record.",
  keywords: ["sustainability", "circular economy", "festival waste", "artisan", "Asia"],
  openGraph: {
    title: "HeriTech",
    description: "We don't just upcycle waste — we build the digital infrastructure that makes upcycling accountable, traceable, and scalable.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
