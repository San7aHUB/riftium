import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riftium — Advanced Card Search",
  description: "Search Magic: The Gathering cards with powerful advanced filters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
