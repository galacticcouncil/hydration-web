import { homepageMarkdownResponse } from "@/lib/markdown-response";

export const dynamic = "force-static";

export function GET() {
  return homepageMarkdownResponse();
}
