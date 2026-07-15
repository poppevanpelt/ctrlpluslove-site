import type { Metadata } from "next";
import { MuseumShop } from "./museum-shop";
import { routeMetadata } from "../seo";

export const metadata: Metadata = routeMetadata("/museum/");

export default function MuseumPage() {
  return <MuseumShop />;
}
