import { homepageMarkdown } from "./agent-content";
import { siteUrl } from "./site";

// Match explicit Markdown requests only. Wildcards keep the browser representation.
// Honor quality weights; an explicit Markdown preference wins an equal-quality tie.
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const ranges = accept.split(",").map((entry) => {
    const [media, ...parameters] = entry.trim().toLowerCase().split(";");
    const qParameter = parameters.map((part) => part.trim()).find((part) => /^q\s*=/.test(part));
    const rawQuality = qParameter?.split("=")[1]?.trim();
    const quality = rawQuality === undefined ? 1 : /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(rawQuality) ? Number(rawQuality) : 0;
    return { media: media.trim(), quality };
  });
  const qualityFor = (media: string) => {
    const matches = ranges.filter((range) => range.media === media);
    return matches.length ? Math.max(...matches.map((range) => range.quality)) : undefined;
  };
  const markdownQuality = qualityFor("text/markdown") ?? 0;
  const htmlQuality = qualityFor("text/html") ?? qualityFor("text/*") ?? qualityFor("*/*") ?? 0;
  return markdownQuality > 0 && markdownQuality >= htmlQuality;
}

export function homepageMarkdownResponse(head = false): Response {
  const markdown = homepageMarkdown();
  return new Response(head ? null : markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Location": "/index.md",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      // Preserve the same request dimensions as Next's HTML/RSC representation.
      "Vary": "Accept, RSC, Next-Router-State-Tree, Next-Router-Prefetch",
      // Approximate budget, not a tokenizer-specific count (four UTF-8 bytes/token).
      "x-markdown-tokens": String(Math.ceil(new TextEncoder().encode(markdown).byteLength / 4)),
      "Link": `<${siteUrl("/")}>; rel="canonical", </llms.txt>; rel="describedby"; type="text/plain"`,
    },
  });
}
