import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Section anchors are not separate pages; referral redirects are not content.
  return [{ url: siteUrl("/") }];
}
