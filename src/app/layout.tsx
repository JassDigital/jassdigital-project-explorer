import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JASS Digital Project Explorer",
  description:
    "Explore the JASS Digital ecosystem of software, AI, data, language technology, land-record tools, and legacy modernization projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
