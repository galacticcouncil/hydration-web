import { NextRequest, NextResponse } from "next/server";
import { homepageMarkdownResponse, prefersMarkdown } from "./lib/markdown-response";

export function middleware(request: NextRequest) {
  if ((request.method === "GET" || request.method === "HEAD") && prefersMarkdown(request.headers.get("accept"))) {
    return homepageMarkdownResponse(request.method === "HEAD");
  }
  const response = NextResponse.next();
  response.headers.set("Vary", "Accept");
  response.headers.set("Link", '</index.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/plain"');
  return response;
}

export const config = {
  matcher: [{
    source: "/",
    // Match before Next's middleware adapter strips these internal headers.
    // Client navigations and prefetches must keep their React wire format.
    missing: [
      { type: "header", key: "rsc" },
      { type: "header", key: "next-router-state-tree" },
      { type: "header", key: "next-router-prefetch" },
    ],
  }],
};
