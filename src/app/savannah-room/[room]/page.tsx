import type { Metadata } from "next";
import SavannahClientRoom from "./SavannahClientRoom";
import { roomBrief } from "./room-briefs";

type PageProps = {
  params: Promise<{ room: string }>;
};

function roomLabel(slug: string) {
  return decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { room } = await params;
  const label = roomLabel(room);
  return {
    title: `${label} · Savannah Room · ctrl+love`,
    description: "A secluded Savannah client room by ctrl+love.",
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function SavannahRoomPage({ params }: PageProps) {
  const { room } = await params;
  return (
    <SavannahClientRoom
      roomSlug={room}
      roomName={roomLabel(room)}
      brief={roomBrief(room)}
    />
  );
}
