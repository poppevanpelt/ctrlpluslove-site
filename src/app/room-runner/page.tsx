import type { Metadata } from "next";

import { RoomRunnerClient } from "./room-runner-client";

export const metadata: Metadata = {
  title: "Room Runner | ctrl+love",
  description:
    "An internal ctrl+love prototype for turning decision questions into visible discussion lineage.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RoomRunnerPage() {
  return <RoomRunnerClient />;
}
