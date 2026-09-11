import { homepageMarkdown } from "@/lib/agent-content";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return new Response(homepageMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Location": "/index.md",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "Link": `<${siteUrl("/")}>; rel="canonical", </llms.txt>; rel="describedby"; type="text/plain"`,
    },
  });
}
