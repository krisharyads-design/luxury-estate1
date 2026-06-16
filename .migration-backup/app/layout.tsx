import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Find What Moves You",
  description: "A cinematic WebGL luxury real estate experience."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
