import type { Metadata } from "next";
import TwoGoClient from "./two-go-client";

export const metadata: Metadata = {
  title: "ctrl+2go | Applied AI. Takeaway size.",
  description: "A few days of us. A useful little machine that stays.",
};

export default function TwoGoPage() {
  return <TwoGoClient />;
}