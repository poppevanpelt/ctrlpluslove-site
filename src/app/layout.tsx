import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ctrlpluslove.com"),
  title: "CTRL+LOVE — Shortcut to reality.",
  description:
    "CTRL+LOVE — Shortcut to reality. Stress-test strategic, creative and commercial decisions before the market does.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "CTRL+LOVE — Shortcut to reality.",
    description:
      "Stress-test strategic, creative and commercial decisions before the market does.",
    url: "https://www.ctrlpluslove.com",
    siteName: "CTRL+LOVE",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/ctrl-love-logo-gradient-master.png",
        width: 1200,
        height: 630,
        alt: "CTRL+LOVE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CTRL+LOVE — Shortcut to reality.",
    description:
      "Stress-test strategic, creative and commercial decisions before the market does.",
    images: ["/ctrl-love-logo-gradient-master.png"],
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var storageKey = "ctrl-love-theme";

                try {
                  if ("serviceWorker" in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function (registrations) {
                      registrations.forEach(function (registration) {
                        registration.unregister();
                      });
                    });
                  }

                  if ("caches" in window) {
                    caches.keys().then(function (keys) {
                      keys.forEach(function (key) {
                        caches.delete(key);
                      });
                    });
                  }
                } catch (error) {}

                function preferredTheme() {
                  try {
                    return localStorage.getItem(storageKey) === "night" ? "night" : "day";
                  } catch (error) {
                    return "day";
                  }
                }

                function applyTheme(theme) {
                  var isNight = theme === "night";
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = isNight ? "dark" : "light";
                  var toggles = document.querySelectorAll("[data-theme-toggle]");
                  toggles.forEach(function (toggle) {
                    toggle.textContent = isNight ? "Day mode" : "Night mode";
                    toggle.setAttribute("aria-label", isNight ? "Switch to day mode" : "Switch to night mode");
                    toggle.setAttribute("aria-pressed", String(isNight));
                  });
                }

                function setTheme(theme) {
                  try {
                    localStorage.setItem(storageKey, theme);
                  } catch (error) {}
                  applyTheme(theme);
                  window.dispatchEvent(new Event("ctrl-love-theme-change"));
                }

                function toggleTheme() {
                  setTheme(document.documentElement.dataset.theme === "night" ? "day" : "night");
                }

                window.ctrlLoveTheme = {
                  get: preferredTheme,
                  apply: applyTheme,
                  set: setTheme,
                  toggle: toggleTheme,
                  storageKey: storageKey
                };

                applyTheme(preferredTheme());

                if (document.readyState === "loading") {
                  document.addEventListener("DOMContentLoaded", function () {
                    applyTheme(preferredTheme());
                  });
                } else {
                  applyTheme(preferredTheme());
                }

                document.addEventListener("click", function (event) {
                  if (event.defaultPrevented) return;
                  var target = event.target;
                  if (!target || !target.closest) return;
                  var toggle = target.closest("[data-theme-toggle]");
                  if (!toggle) return;
                  event.preventDefault();
                  toggleTheme();
                });
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
