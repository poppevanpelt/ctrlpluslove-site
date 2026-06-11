import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Department of Reality Preservation — ctrl+love",
};

export default function RealityPage() {
  return (
    <main className="document-page">
      <Image
        className="document-image"
        src="/reality-poster.png"
        alt="Department of Reality Preservation"
        width={1792}
        height={1024}
        priority
        unoptimized
      />
    </main>
  );
}
