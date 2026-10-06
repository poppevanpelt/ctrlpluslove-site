import { NextRequest, NextResponse } from "next/server";

type RoomKey = "bridgefund" | "luther" | "bonkers" | "lab";

const campaignHosts = new Set([
  "laatjenietnaaien.nl",
  "www.laatjenietnaaien.nl",
  "laatjenietnaaien.ctrlpluslove.com",
]);

const ROOM_ACCESS: Record<RoomKey, { cookie: string; hashes: string[] }> = {
  bridgefund: {
    cookie: "ctrl_room_bridgefund",
    hashes: [
      "a4968c9163131e3afc445652eabd392e5c07003c8cad43763759d603c0848035",
      "68c82b3f61af76472c96e886e89aeae7a581e114741634c85f37ebe97237a8c9",
      "f74010a7850101fee5f2508b0d36b3dbe238713437adc111ae5365fa6b9d0341",
    ],
  },
  luther: {
    cookie: "ctrl_room_luther",
    hashes: [
      "9626cd5c62a29d7b762ea10cde9c9720155e61784f16c8e2f6d104f8bb46c4a2",
      "8ede6b9025a61ab4f32be5a2b9f79fdbabd740d03065dbb28678952350b3c1c2",
      "f91fbf9ddffa618dfe77f92e3c7b08a24d3a77d9272fa31fc662e25bccd4b475",
      "2a86463b9035b1da81180513ee783cb7fab3d0d76426f96563ef1f8778a65483",
      "ea3ad65109d698e7ffa795a20b4b32c284d90aae303df5a07655add8bcc0ab0e",
    ],
  },
  bonkers: {
    cookie: "ctrl_room_bonkers",
    hashes: [
      "f19c0c3cf0a9be1e3dab0115967f0bdf8b5b9c122b64219d2b2d29f623a91d8f",
      "d81c0ffefa03a0d0ec7f521a58f31e2b39feb6aadab40fb298d9013b042d2894",
    ],
  },
  lab: {
    cookie: "ctrl_room_lab",
    hashes: [
      "df82b570c2a126dcd8ef6b0ecd62834660673cc774db6f4058985c9e48d94f26",
    ],
  },
};

function roomForPath(pathname: string): RoomKey | null {
  if (pathname.startsWith("/savannah-room/bridgefund")) return "bridgefund";
  if (pathname.startsWith("/savannah-room/luther")) return "luther";
  if (pathname.startsWith("/savannah-room/bonkers")) return "bonkers";
  if (pathname === "/bonkers" || pathname.startsWith("/bonkers/")) return "bonkers";

  if (
    pathname === "/bridgefund-ted" ||
    pathname.startsWith("/bridgefund-ted/") ||
    pathname === "/morning-chris" ||
    pathname.startsWith("/morning-chris/") ||
    pathname === "/ted-talks" ||
    pathname.startsWith("/ted-talks/")
  ) {
    return "bridgefund";
  }

  if (
    pathname === "/savannah-test" ||
    pathname.startsWith("/savannah-test/") ||
    pathname === "/ted-test" ||
    pathname.startsWith("/ted-test/")
  ) {
    return "lab";
  }

  return null;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function isValidToken(room: RoomKey, token: string) {
  const tokenHash = await sha256(token);
  return ROOM_ACCESS[room].hashes.includes(tokenHash);
}

function campaignRewrite(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();

  if (
    request.method === "GET" &&
    campaignHosts.has(host) &&
    request.nextUrl.pathname === "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/laatjenietnaaien/";
    return NextResponse.rewrite(url);
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const campaign = campaignRewrite(request);
  if (campaign) return campaign;

  const room = roomForPath(request.nextUrl.pathname);
  if (!room) return NextResponse.next();

  const rule = ROOM_ACCESS[room];
  const invite = request.nextUrl.searchParams.get("key");
  const remembered = request.cookies.get(rule.cookie)?.value;
  const candidate = invite || remembered;

  if (candidate && await isValidToken(room, candidate)) {
    if (!invite) return NextResponse.next();

    const clean = request.nextUrl.clone();
    clean.searchParams.delete("key");
    const response = NextResponse.redirect(clean);
    response.cookies.set(rule.cookie, candidate, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
    return response;
  }

  const locked = request.nextUrl.clone();
  locked.pathname = "/private-room";
  locked.search = "";
  locked.searchParams.set("room", room);
  return NextResponse.rewrite(locked);
}

export const proxyConfig = {
  matcher: [
    "/",
    "/savannah-room/bridgefund/:path*",
    "/savannah-room/luther/:path*",
    "/savannah-room/bonkers/:path*",
    "/bonkers",
    "/bonkers/:path*",
    "/bridgefund-ted/:path*",
    "/morning-chris/:path*",
    "/ted-talks/:path*",
    "/savannah-test/:path*",
    "/ted-test/:path*",
  ],
};
