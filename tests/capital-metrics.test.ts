import assert from "node:assert/strict";
import test from "node:test";
import { createCapitalMetricsService } from "../src/api/capital-metrics.server";
import {
  capitalMetricDefinitions,
  emptyCapitalMetrics,
  parseCapitalMetrics,
} from "../src/lib/capital-metrics";

const START = Date.parse("2026-09-10T12:00:00Z");
// Spec values from docs/capital-metrics.md, not the implementation's constants.
const DAY = 24 * 60 * 60 * 1000;
const tvlUrl = "https://hydration-api.neckwork.net/hydration-web/v1/stats";
const dexUrl = "https://api.llama.fi/summary/fees/hydration-dex?dataType=dailySupplySideRevenue&excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true";
const lendingUrl = "https://api.llama.fi/summary/fees/hydration-lending?dataType=dailySupplySideRevenue&excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true";
const platformUrl = "https://hydration-api.neckwork.net/v1/stats/platform";
const urls = [tvlUrl, dexUrl, lendingUrl, platformUrl];
const platform = (overrides: Record<string, unknown> = {}) => ({
  asOf: new Date(START).toISOString(),
  hollar: { totalSupply: "12700000000000000000000000" },
  protocolRevenue: { allTimeUsd: "2980000.00" },
  ...overrides,
});

function fixture() {
  let clock = START;
  const payloads = new Map<string, unknown>([
    [tvlUrl, { tvl: 63_200_000 }],
    [dexUrl, { totalAllTime: 1_500_000 }],
    [lendingUrl, { totalAllTime: 1_400_000 }],
    [platformUrl, platform()],
  ]);
  const failures = new Set<string>();
  const calls: string[] = [];
  const inits: (RequestInit | undefined)[] = [];
  const fetcher: typeof fetch = async (url, init) => {
    const key = String(url);
    calls.push(key);
    inits.push(init);
    return failures.has(key) || !payloads.has(key)
      ? new Response("Unavailable", { status: 503 })
      : Response.json(payloads.get(key));
  };
  const service = createCapitalMetricsService({ fetcher, now: () => clock, warn: () => {} });
  return { service, payloads, failures, calls, inits, advance: (ms: number) => { clock += ms; } };
}

test("maps the four metrics to their actual source fields and preserves units", async () => {
  const { service, calls, inits } = fixture();
  const response = await service();
  assert.equal(response.version, 2);
  assert.deepEqual(response.metrics.map((metric) => [metric.id, metric.value, metric.prefix]), [
    ["allocated", 63_200_000, "$"],
    ["earned", 2_900_000, "$"],
    ["generated", 2_980_000, "$"],
    ["hollar", 12_700_000, ""],
  ]);
  assert.ok(response.metrics.every((metric) => metric.status === "fresh"));
  assert.ok(response.metrics.every((metric) => metric.asOf === null));
  assert.deepEqual(new Set(calls), new Set(urls));
  assert.ok(inits.every((init) => init?.cache === "no-store" && init.signal));
});

test("coalesces simultaneous requests and refreshes each source at its own interval", async () => {
  const { service, calls, advance } = fixture();
  const [first, second] = await Promise.all([service(), service()]);
  assert.deepEqual(first, second);
  assert.equal(calls.length, 5);
  await service();
  assert.equal(calls.length, 5);
  advance(301_000);
  await service();
  assert.equal(calls.length, 5);
  advance(300_000);
  await service();
  assert.deepEqual(new Set(calls.slice(5)), new Set([tvlUrl, platformUrl]));
  assert.equal(calls.length, 7);
  advance(3_000_000);
  await service();
  assert.deepEqual(new Set(calls.slice(7)), new Set(urls));
  assert.equal(calls.length, 12);
});

test("one failed provider does not hide independent metrics or produce a partial yield sum", async () => {
  const { service, failures } = fixture();
  failures.add(lendingUrl);
  const { metrics } = await service();
  assert.equal(metrics[1].value, null);
  assert.equal(metrics[1].status, "unavailable");
  assert.ok(metrics.filter((metric) => metric.id !== "earned").every((metric) => metric.value !== null));
});

test("keeps last good data during an outage, backs off, recovers and eventually expires", async () => {
  const { service, failures, calls, payloads, advance } = fixture();
  await service();
  advance(601_000);
  failures.add(tvlUrl);
  let { metrics } = await service();
  assert.equal(metrics[0].value, 63_200_000);
  assert.equal(metrics[0].status, "stale");
  assert.equal(metrics[0].retrievedAt, new Date(START).toISOString());
  const count = calls.length;
  await service();
  assert.equal(calls.length, count);

  failures.delete(tvlUrl);
  payloads.set(tvlUrl, { tvl: 64_000_000 });
  advance(60_000);
  ({ metrics } = await service());
  assert.equal(metrics[0].value, 64_000_000);
  assert.equal(metrics[0].status, "fresh");

  failures.add(tvlUrl);
  advance(DAY + 1);
  ({ metrics } = await service());
  assert.equal(metrics[0].value, null);
  assert.equal(metrics[0].status, "unavailable");
});

test("does not coerce missing, nonnumeric, negative or infinite amounts into valid figures", async () => {
  for (const invalid of [undefined, null, "123", -1, Infinity, NaN]) {
    const { service, payloads } = fixture();
    payloads.set(tvlUrl, { tvl: invalid });
    const { metrics } = await service();
    assert.equal(metrics[0].value, null);
    assert.equal(metrics[0].status, "unavailable");
  }
  const { service, payloads } = fixture();
  payloads.set(tvlUrl, { tvl: 0 });
  assert.equal((await service()).metrics[0].value, 0);
});

test("rejects expired or invalid platform timestamps", async () => {
  for (const asOf of [undefined, null, "bad-date", new Date(START - DAY - 1).toISOString(), new Date(START + 61_000).toISOString()]) {
    const { service, payloads } = fixture();
    payloads.set(platformUrl, platform({ asOf }));
    const { metrics } = await service();
    assert.equal(metrics[2].value, null);
    assert.equal(metrics[3].value, null);
  }
  const { service, payloads } = fixture();
  payloads.set(platformUrl, platform({ asOf: new Date(START - 10 * 60_000).toISOString() }));
  assert.ok((await service()).metrics.every((metric) => metric.status === "fresh"));
});

test("parses platform decimal strings and rejects null or malformed ones", async () => {
  for (const invalid of [null, 123, "", "-1", "1e6", "abc"]) {
    const { service, payloads } = fixture();
    payloads.set(platformUrl, platform({ hollar: { totalSupply: invalid }, protocolRevenue: { allTimeUsd: invalid } }));
    const { metrics } = await service();
    assert.equal(metrics[2].value, null);
    assert.equal(metrics[3].value, null);
  }
});

test("network timeouts are isolated just like HTTP failures", async () => {
  const service = createCapitalMetricsService({
    fetcher: async () => { throw new DOMException("Timed out", "TimeoutError"); },
    now: () => START,
    warn: () => {},
  });
  assert.ok((await service()).metrics.every((metric) => metric.value === null && metric.status === "unavailable"));
});

test("browser validation rejects old caches and keeps source definitions under app control", () => {
  assert.throws(() => parseCapitalMetrics({ version: 1, metrics: [] }, START));
  assert.throws(() => parseCapitalMetrics(null, START));
  const metrics = emptyCapitalMetrics();
  const input = {
    ...metrics[0], value: 1, status: "fresh", retrievedAt: new Date(START).toISOString(),
    title: "Wrong title", provider: "Wrong provider", sources: ["https://example.com"],
  };
  const parsed = parseCapitalMetrics({ version: 2, metrics: [input] }, START);
  assert.equal(parsed[0].value, 1);
  assert.equal(parsed[0].provider, "Neckwork");
  assert.deepEqual(parsed[0].sources, capitalMetricDefinitions[0].sources);
  assert.equal(parsed[0].title, capitalMetricDefinitions[0].title);
  assert.equal(parsed[1].value, null);
});

test("browser validation ages saved values and also checks the source timestamp", () => {
  const metric = {
    ...emptyCapitalMetrics()[2], value: 0, status: "fresh",
    retrievedAt: new Date(START).toISOString(), asOf: new Date(START - 3_601_000).toISOString(),
  };
  const parse = (entry: unknown, time = START) => parseCapitalMetrics({ version: 2, metrics: [entry] }, time)[2];
  assert.equal(parse(metric).value, 0);
  assert.equal(parse(metric).status, "stale");
  assert.equal(parse(metric, START + DAY).value, null);
  for (const fields of [
    { value: "1" }, { value: -1 }, { asOf: {} }, { asOf: undefined },
    { retrievedAt: "not a date" }, { retrievedAt: new Date(START + 61_000).toISOString() },
    { status: "unknown" },
  ]) assert.equal(parse({ ...metric, ...fields }).value, null);
});
