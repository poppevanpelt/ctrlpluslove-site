import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { routeMetadata, SITE_URL } from "./seo";
import { BackgroundSoundtrack } from "./background-soundtrack";
import { CtrlLayerProvider } from "./ctrl-layer";
import { LivingOffice } from "./living-office";
import { ProjectNavigation } from "./project-navigation";
import { SteelBallCursor } from "./steel-ball-cursor";
import { TimeAwareAmbience } from "./time-aware-ambience";

export const metadata: Metadata = {
  ...routeMetadata("/"),
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <CtrlLayerProvider>
          <ProjectNavigation />
          {children}
          <TimeAwareAmbience />
          <LivingOffice />
          <BackgroundSoundtrack />
          <SteelBallCursor />
          <Analytics />
          <SpeedInsights />
        </CtrlLayerProvider>
      </body>
    </html>
  );
}
