import { NextRequest, NextResponse } from "next/server";

type RoomKey = "luther" | "bonkers";

const ROOM_ACCESS: Record<RoomKey, { cookie: string; hashes: string[] }> = {
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
};

function roomForPath(pathname: string): RoomKey | null {
  if (pathname.startsWith("/savannah-room/luther")) return "luther";
  if (pathname.startsWith("/savannah-room/bonkers")) return "bonkers";
  if (pathname === "/bonkers" || pathname.startsWith("/bonkers/")) return "bonkers";
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

export async function proxy(request: NextRequest) {
  const room = roomForPath(request.nextUrl.pathname);
  if (!room) {
    const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
    if (request.method === "GET" && ["laatjenietnaaien.nl", "www.laatjenietnaaien.nl", "laatjenietnaaien.ctrlpluslove.com"].includes(host) && request.nextUrl.pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/laatjenietnaaien/";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

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

export const config = {
  matcher: [
    "/",
    "/savannah-room/luther/:path*",
    "/savannah-room/bonkers/:path*",
    "/bonkers",
    "/bonkers/:path*",
  ],
};
