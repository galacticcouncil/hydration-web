import { NextResponse } from "next/server";

export function middleware() {
  // Use an explicit alternate URL: Next 14 can overwrite Vary on cached pages,
  // making Accept-based HTML/Markdown rewrites unsafe behind a shared cache.
  const response = NextResponse.next();
  response.headers.set("Link", '</index.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/plain"');
  return response;
}

export const config = { matcher: "/" };
