import type { Metadata } from "next";

import { routeMetadata } from "../seo";
import { RoomRunnerClient } from "./room-runner-client";

export const metadata: Metadata = {
  ...routeMetadata("/room-runner/"),
  title: "Room Runner | ctrl+love",
  description:
    "An internal ctrl+love prototype for turning decision questions into visible discussion lineage.",
};

export default function RoomRunnerPage() {
  return <RoomRunnerClient />;
}
