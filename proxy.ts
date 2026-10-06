import { NextRequest, NextResponse } from "next/server";

type RoomKey = "luther" | "bonkers";

const ROOM_ACCESS: Record<RoomKey, { cookie: string; hashes: Record<string, string> }> = {
  luther: {
    cookie: "ctrl_room_luther",
    hashes: {
      "poppe-van-pelt": "a770eb7036257ae491b55a12eb7f50fc04f5e0c628129876ba231a83befa3ae8",
      "robin-stam": "cc69958143646e9b68609d79fe224149d9716ad4eea302d1e48599060c5bcda7",
      "sjoerd-verbrugge": "c08c953c0611a2ae6a8f331d070b7c9eae8d6c90f98adc9abe23e2a8d02d83d8",
      "joris-van-tubergen": "2b8da4415dacf8ca1fc359e4edba77cf1fa5f21fb1d3a62be7609c3d6cb47b71",
      "winnie-plantinga": "976475fb68d0c2344fe9926e9575257d480b8df5eb3de6ce11e1239f12826a2e",
    },
  },
  bonkers: {
    cookie: "ctrl_room_bonkers",
    hashes: {
      "poppe-van-pelt": "85635a067b808baac2bac16f55bd314b7e580c6a68fafbfc64105680361d3ef0",
      "saskia-kok": "add6d2eadfdf41d1d4afe9d6295416cdab5ddf15f22dacef85411c22cb029266",
    },
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
  return Object.values(ROOM_ACCESS[room].hashes).includes(tokenHash);
}

export async function proxy(request: NextRequest) {
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

export const config = {
  matcher: [
    "/savannah-room/luther/:path*",
    "/savannah-room/bonkers/:path*",
    "/bonkers/:path*",
  ],
};
