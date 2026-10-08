import { getCachedCapitalMetrics } from "@/api/capital-metrics.cached";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getCachedCapitalMetrics();
  const available = data.metrics.some((metric) => metric.value !== null);
  const fresh = data.metrics.every((metric) => metric.status === "fresh");
  return Response.json(data, {
    status: available ? 200 : 503,
    headers: {
      "Cache-Control": fresh
        ? "public, max-age=0, s-maxage=60, stale-while-revalidate=60"
        : "no-store",
    },
  });
}
