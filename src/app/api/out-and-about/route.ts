import { NextRequest, NextResponse } from "next/server";

import { buildOutAndAboutMessage } from "@/lib/outAndAbout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function decodeHeader(value: string | null) {
  if (!value) return undefined;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function GET(request: NextRequest) {
  const areaOverride = request.nextUrl.searchParams.get("area") ?? undefined;
  const city = decodeHeader(request.headers.get("x-vercel-ip-city"));
  const region = decodeHeader(request.headers.get("x-vercel-ip-country-region"));
  const country = decodeHeader(request.headers.get("x-vercel-ip-country"));

  const message = buildOutAndAboutMessage({
    city,
    region,
    country,
    areaOverride,
  });

  return NextResponse.json(
    {
      ok: true,
      mode: "out-and-about",
      locationMode: areaOverride ? "coarse-override" : "coarse-network",
      locationStored: false,
      subject: message.subject,
      body: message.body,
      note: message.note,
      profile: message.profile,
      publicArea: message.publicArea,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
