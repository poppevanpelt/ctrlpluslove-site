import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./cabinet-drawers.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { routeMetadata, SITE_URL } from "./seo";
import { CtrlLayerProvider } from "./ctrl-layer";
import { ProjectNavigation } from "./project-navigation";

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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ctrl+love",
  url: "https://www.ctrlpluslove.com/",
  description:
    "ctrl+love is an applied-intelligence practice that exposes weak evidence, missing voices, hidden conflict and decisions nobody owns. A shortcut to reality.",
  founder: {
    "@type": "Person",
    name: "Poppe van Pelt",
  },
  slogan: "Shortcut to reality.",
  knowsAbout: [
    "Organizational decision-making",
    "Applied artificial intelligence",
    "Organic AI",
    "Organic AI presence",
    "AI reputation",
    "Human-AI collaboration",
    "Collective intelligence",
    "Evidence and uncertainty",
    "Live group intelligence",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ctrl+love",
  url: "https://www.ctrlpluslove.com/",
  description:
    "Applied AI, Organic AI and better organizational decisions.",
  publisher: {
    "@type": "Organization",
    name: "ctrl+love",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script id="masslytics" strategy="beforeInteractive">
          {`!function(s,e,t,r){var a=e.createElement("script");a.async=!0;a.src="https://cdn.masslytics.io/masslytics.js";var c=e.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c);s.masslyticsApiSubdomain="app";s.masslyticsBrandId="SW-729448";}(window,document);`}
        </Script>
        <Script src="/cabinet-drawers.js" strategy="afterInteractive" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <CtrlLayerProvider>
          <ProjectNavigation />
          {children}
          <Analytics />
          <SpeedInsights />
        </CtrlLayerProvider>
      </body>
    </html>
  );
}
