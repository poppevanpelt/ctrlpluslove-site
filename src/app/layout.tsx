import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./cabinet-drawers.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { routeMetadata, SITE_URL } from "./seo";
import { CtrlLayerProvider } from "./ctrl-layer";
import { ProjectNavigation } from "./project-navigation";
import { SystemShock } from "./system-shock";

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
  url: `${SITE_URL}/`,
  description:
    "ctrl+love builds and field-tests AI-assisted instruments for human judgment, pressure-testing evidence, assumptions, opposition and decision risk before important choices become expensive.",
  founder: {
    "@type": "Person",
    name: "Poppe van Pelt",
    jobTitle: "Applied AI Decision Systems Engineer",
    url: `${SITE_URL}/`,
  },
  slogan: "Instruments for human judgment.",
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
  url: `${SITE_URL}/`,
  description:
    "AI-assisted instruments for human judgment by ctrl+love, founded by Poppe van Pelt.",
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
        <Script id="posthog" strategy="beforeInteractive">
          {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="vu fu pu gu bu init Hu zu qu ju Gu Xl Bu Qu Du eh ih nh sh rh oh capture getExtension Uu cu hh calculateEventProperties uh register register_once register_for_session unregister unregister_for_session gh Nu dh getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync mh identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset yh shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty fh Xu createPersonProfile setInternalOrTestUser ph wu opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Ju debug Yl Os getPageViewId captureTraceFeedback captureTraceMetric Ru".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_nXPhwXLd8X7Tt9qXDwtAYJAUFYiTsBCfNzjQqEwLvFbK',{api_host:'https://eu.i.posthog.com',defaults:'2026-05-30',person_profiles:'identified_only'});`}
        </Script>
        <Script src="/cabinet-drawers.js" strategy="afterInteractive" />
        <Script id="retire-legacy-service-worker" strategy="afterInteractive">
          {`if ("serviceWorker" in navigator) {
            navigator.serviceWorker
              .register("/sw.js?v=20260920-retire-2", { updateViaCache: "none" })
              .catch(function () {});
          }`}
        </Script>
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <CtrlLayerProvider>
          <ProjectNavigation />
          {children}
          <SystemShock />
          <Analytics />
          <SpeedInsights />
        </CtrlLayerProvider>
      </body>
    </html>
  );
}
