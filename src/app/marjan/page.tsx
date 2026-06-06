import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dear Marjan — ctrl+love",
};

export default function MarjanPage() {
  return (
    <main className="document-page">
      <Image
        className="document-image"
        src="/dear-marjan.png"
        alt="Dear Marjan"
        width={1024}
        height={1536}
        priority
        unoptimized
      />
    </main>
  );
}
