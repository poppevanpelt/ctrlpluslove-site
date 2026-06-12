import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ctrlpluslove.com"),
  title: "ctrl+love",
  description:
    "A decision stress-test room for strategies, launches, and high-stakes ideas.",
  openGraph: {
    title: "ctrl+love",
    description:
      "A decision stress-test room for strategies, launches, and high-stakes ideas.",
    url: "https://www.ctrlpluslove.com",
    siteName: "ctrl+love",
    images: [
      {
        url: "/reality-poster.png",
        width: 1672,
        height: 941,
        alt: "ctrl+love",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ctrl+love",
    description:
      "A decision stress-test room for strategies, launches, and high-stakes ideas.",
    images: ["/reality-poster.png"],
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
