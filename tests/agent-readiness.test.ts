import assert from "node:assert/strict";
import test from "node:test";
import { homepageMarkdown, homepageStructuredData, llmsText } from "../src/lib/agent-content";
import { site } from "../src/lib/site";

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
  // Repeated requests must never mix the cached visual page with Markdown.
  for (const accept of ["text/markdown", "text/html", "*/*", "text/markdown"]) {
    const visual = await request("/", { headers: { Accept: accept } });
    assert.match(visual.headers.get("content-type") ?? "", /text\/html/);
    assert.match(visual.headers.get("link") ?? "", /<\/index.md>; rel="alternate"/);
    const plain = await request("/index.md", { headers: { Accept: accept } });
    assert.match(plain.headers.get("content-type") ?? "", /text\/markdown/);
    assert.equal(await plain.text(), homepageMarkdown());
  }
  const markdownHead = await request("/index.md", { method: "HEAD" });
  assert.equal(markdownHead.status, 200);
  assert.match(markdownHead.headers.get("content-type") ?? "", /text\/markdown/);
  assert.equal(await markdownHead.text(), "");
  const rsc = await request("/?_rsc=agent-readiness-check", { headers: { RSC: "1" } });
  assert.match(rsc.headers.get("content-type") ?? "", /text\/x-component/);

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
