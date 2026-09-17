import assert from "node:assert/strict";
import test from "node:test";
import { homepageMarkdown, homepageStructuredData, llmsText } from "../src/lib/agent-content";
import { site } from "../src/lib/site";
import { homepageMarkdownResponse, prefersMarkdown } from "../src/lib/markdown-response";

test("Markdown negotiation requires an explicit acceptable preference", () => {
  for (const accept of [null, "", "*/*", "text/*", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "application/json", "text/markdown;q=0", "text/markdown;q=oops", "text/markdown;q=1.1", "text/markdown;q=0.5,text/html", "text/markdown;q=0.5,*/*;q=0.9", "text/markdownish"]) {
    assert.equal(prefersMarkdown(accept), false, String(accept));
  }
  for (const accept of ["text/markdown", "TEXT/MARKDOWN; charset=utf-8", "text/markdown, text/html", "text/html;q=0.8, text/markdown", "text/html;q=0, text/markdown;q=0.5, */*", "text/markdown;q=0.5, */*;q=0.1"]) {
    assert.equal(prefersMarkdown(accept), true, accept);
  }
});

test("Markdown GET and HEAD share representation metadata and an estimated token budget", async () => {
  const get = homepageMarkdownResponse();
  const head = homepageMarkdownResponse(true);
  assert.deepEqual([...head.headers], [...get.headers]);
  assert.equal(await head.text(), "");
  assert.equal(await get.text(), homepageMarkdown());
  assert.ok(Number(get.headers.get("x-markdown-tokens")) > 0);
  for (const header of ["etag", "content-encoding", "content-range"]) assert.equal(get.headers.get(header), null);
});

test("readable content contains the homepage story without advertising data endpoints", () => {
  const markdown = homepageMarkdown();
  for (const text of ["One integrated financial system", "Appchain-level execution", "Security without compromise", "Powered by HDX", "Built and governed by the community"]) {
    assert.ok(markdown.includes(text), text);
  }
  assert.ok(!/<script|<style|localhost|127\.0\.0\.1/.test(markdown));
  assert.ok(!/\$\d/.test(markdown), "do not freeze changing balances in the page description");
  assert.ok(llmsText().includes(`${site.url}/index.md`));
  for (const content of [markdown, llmsText(), JSON.stringify(homepageStructuredData())]) {
    assert.doesNotMatch(content, /\/api\/|openapi\.json|api-catalog|Refresh interval|Source data/);
  }
});

test("structured data describes the actual site without invented ratings or financial offers", () => {
  const graph = homepageStructuredData();
  assert.equal(graph["@context"], "https://schema.org");
  assert.deepEqual(graph["@graph"].map((node) => node["@type"]), ["Organization", "WebSite", "WebPage"]);
  const serialized = JSON.stringify(graph);
  assert.ok(!/aggregateRating|FAQPage|FinancialProduct|Offer|SearchAction/.test(serialized));
  assert.ok(serialized.includes(`${site.url}/#security`));
});

const base = process.env.AGENT_READINESS_BASE_URL;
test("served HTML, Markdown, crawl files and discovery endpoints work together", { skip: !base }, async () => {
  const request = (path: string, init?: RequestInit) => fetch(new URL(path, base), { ...init, signal: AbortSignal.timeout(20_000) });
  const html = await request("/", { headers: { Accept: "text/html" } });
  assert.equal(html.status, 200);
  assert.match(html.headers.get("content-type") ?? "", /text\/html/);
  assert.doesNotMatch(html.headers.get("link") ?? "", /api-catalog|openapi/);
  assert.match(html.headers.get("link") ?? "", /<\/index.md>; rel="alternate"; type="text\/markdown"/);
  const markup = await html.text();
  assert.match(markup, /rel="canonical" href="https:\/\/hydration.net\/?"/);
  assert.equal((markup.match(/<h1\b/g) ?? []).length, 1);
  const jsonLd = markup.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  assert.ok(jsonLd);
  assert.deepEqual(JSON.parse(jsonLd), homepageStructuredData());
  assert.ok(markup.includes('<span class="sr-only">A secure home for your onchain capital.</span>'));
  assert.doesNotMatch(markup, /api-catalog|openapi\.json|href="\/api\/capital-metrics"/);

  const markdown = await request("/index.md");
  assert.equal(markdown.status, 200);
  assert.match(markdown.headers.get("content-type") ?? "", /text\/markdown/);
  assert.doesNotMatch(markdown.headers.get("link") ?? "", /api-catalog|openapi/);
  assert.equal(await markdown.text(), homepageMarkdown());
  // Exercise the warmed production cache in both orders; HTML must retain Accept
  // alongside Next's Vary dimensions on every response, not just the first one.
  for (const accept of ["text/markdown", "text/html", "*/*", "text/markdown", "text/html", "text/markdown;q=0", "text/markdown;q=0.5,text/html", "text/markdown,text/html", "text/html"]) {
    const response = await request("/", { headers: { Accept: accept } });
    const isMarkdown = prefersMarkdown(accept);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", isMarkdown ? /text\/markdown/ : /text\/html/);
    const vary = (response.headers.get("vary") ?? "").toLowerCase().split(/\s*,\s*/);
    for (const dimension of ["accept", "rsc", "next-router-state-tree", "next-router-prefetch"]) assert.ok(vary.includes(dimension), `${accept}: missing Vary: ${dimension}`);
    if (isMarkdown) {
      assert.equal(await response.text(), homepageMarkdown());
      assert.ok(Number(response.headers.get("x-markdown-tokens")) > 0);
      assert.equal(response.headers.get("content-location"), "/index.md");
    } else {
      assert.match(response.headers.get("link") ?? "", /<\/index.md>; rel="alternate"/);
      assert.match(await response.text(), /<html/);
      assert.equal(response.headers.get("x-markdown-tokens"), null);
    }
    const plain = await request("/index.md", { headers: { Accept: accept } });
    assert.match(plain.headers.get("content-type") ?? "", /text\/markdown/);
    assert.equal(await plain.text(), homepageMarkdown());
  }
  const markdownHead = await request("/index.md", { method: "HEAD" });
  assert.equal(markdownHead.status, 200);
  assert.match(markdownHead.headers.get("content-type") ?? "", /text\/markdown/);
  assert.equal(await markdownHead.text(), "");
  for (const accept of ["text/markdown", "text/html"]) {
    const head = await request("/", { method: "HEAD", headers: { Accept: accept } });
    assert.equal(head.status, 200);
    assert.match(head.headers.get("content-type") ?? "", accept === "text/markdown" ? /text\/markdown/ : /text\/html/);
    assert.match(head.headers.get("vary") ?? "", /\bAccept\b/i);
    assert.equal(await head.text(), "");
    for (const path of ["/", "/?_rsc=agent-readiness-check"]) {
      const rsc = await request(path, { headers: { RSC: "1", Accept: accept } });
      assert.match(rsc.headers.get("content-type") ?? "", /text\/x-component/);
    }
  }
  const withQuery = await request("/?utm_source=agent", { headers: { Accept: "text/markdown" } });
  assert.equal(await withQuery.text(), homepageMarkdown());

  const robots = await request("/robots.txt");
  assert.match(robots.headers.get("content-type") ?? "", /text\/plain/);
  assert.match(await robots.text(), /Sitemap: https:\/\/hydration.net\/sitemap.xml/);
  const sitemap = await request("/sitemap.xml");
  assert.match(sitemap.headers.get("content-type") ?? "", /xml/);
  const xml = await sitemap.text();
  assert.equal((xml.match(/<loc>/g) ?? []).length, 1);
  assert.ok(!xml.includes("localhost"));
  const llms = await request("/llms.txt");
  assert.equal(await llms.text(), llmsText());

  const catalog = await request("/.well-known/api-catalog");
  assert.equal(catalog.status, 404);
  const spec = await request("/openapi.json");
  // Unknown single-segment paths use the existing referral route, not an API spec.
  assert.doesNotMatch(spec.headers.get("content-type") ?? "", /application\/json/);
  const referral = await request("/agent-readiness-test-referral");
  assert.match(await referral.text(), /name="robots" content="noindex, nofollow"/);
});
