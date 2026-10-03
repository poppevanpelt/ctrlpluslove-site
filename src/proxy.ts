import { NextRequest, NextResponse } from "next/server";

const campaignHosts = new Set([
  "laatjenietnaaien.nl",
  "www.laatjenietnaaien.nl",
  "laatjenietnaaien.ctrlpluslove.com",
]);

export function proxy(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
