import type { Metadata } from "next";
import { createPageMetadata } from "../seo";
import DoseClient from "./dose-client";

export const metadata: Metadata = createPageMetadata({
  path: "/dose/",
  title: "CTRL+DOSE — ctrl+love",
  description:
    "A relationship-bandwidth instrument that turns WhatsApp behaviour into individual communication guidelines before another beautiful thing gets sent.",
});

export default function DosePage() {
  return <DoseClient />;
}
