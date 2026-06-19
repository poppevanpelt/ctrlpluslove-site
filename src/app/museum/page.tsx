import type { Metadata } from "next";
import { MuseumShop } from "./museum-shop";

export const metadata: Metadata = {
  title: "Museum Shop — ctrl+love",
  description: "Ideas. Artifacts. Consequences. Objects from the ctrl+love archive.",
};

export default function MuseumPage() {
  return <MuseumShop />;
}
