import type { Metadata } from "next";
import BlackoutClient from "./blackout-client";
import "./blackout.css";

export const metadata: Metadata = {
  title: "CTRL+BLACKOUT | ctrl+love",
  description: "AI continuity drill. Find out what quietly breaks when the models disappear.",
};

export default function CtrlBlackoutPage() {
  return <BlackoutClient />;
}
