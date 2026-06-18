import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ctrlpluslove.com"),
  title: "ctrl+love",
  description:
    "Shortcut to reality. Stress-test your decisions before the market does.",
  openGraph: {
    title: "ctrl+love",
    description:
      "Shortcut to reality. Stress-test your decisions before the market does.",
    url: "https://www.ctrlpluslove.com",
    siteName: "ctrl+love",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ctrl+love",
    description:
      "Shortcut to reality. Stress-test your decisions before the market does.",
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
