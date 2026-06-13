import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ctrlpluslove.com"),
  title: "ctrl+love",
  description: "Shortcut to reality. Powered by billions of human signals.",
  openGraph: {
    title: "ctrl+love",
    description: "Shortcut to reality. Powered by billions of human signals.",
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
    description: "Shortcut to reality. Powered by billions of human signals.",
    images: ["/reality-poster.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="theme-mode" strategy="beforeInteractive">
          {`
            (function () {
              function preferredTheme() {
                try {
                  return localStorage.getItem("ctrl-love-theme") || "day";
                } catch (error) {
                  return "day";
                }
              }

              function applyTheme(theme) {
                var isNight = theme === "night";
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = isNight ? "dark" : "light";
                var toggle = document.querySelector("[data-theme-toggle]");
                if (toggle) {
                  toggle.textContent = isNight ? "Day" : "Night";
                  toggle.setAttribute("aria-label", isNight ? "Switch to day mode" : "Switch to night mode");
                  toggle.setAttribute("aria-pressed", String(isNight));
                }
              }

              applyTheme(preferredTheme());

              document.addEventListener("DOMContentLoaded", function () {
                applyTheme(preferredTheme());
                var toggle = document.querySelector("[data-theme-toggle]");
                if (!toggle) return;

                toggle.addEventListener("click", function () {
                  var nextTheme = document.documentElement.dataset.theme === "night" ? "day" : "night";
                  try {
                    localStorage.setItem("ctrl-love-theme", nextTheme);
                  } catch (error) {}
                  applyTheme(nextTheme);
                });
              });
            })();
          `}
        </Script>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
