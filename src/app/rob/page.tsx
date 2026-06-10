import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dear Rob — ctrl+love",
};

export default function RobPage() {
  return (
    <main className="document-page">
      <Image
        className="document-image"
        src="/dear-rob.png"
        alt="Dear Rob"
        width={1024}
        height={1536}
        priority
        unoptimized
      />
    </main>
  );
}
