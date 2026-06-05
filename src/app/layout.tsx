import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ctrl+love",
  description: "Stress-test your decisions before the market does.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
