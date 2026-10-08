import type { StaticImageData } from "next/image";
import RecentPostsClient from "./recent-posts-client";

import AssumeBreachImage from "@/posts/breach.webp";
import MarchAprilNewsletterImage from "@/posts/bimonthly2.webp";
import HydratedStrategyImage from "@/posts/strategy.webp";
import JanuaryFebruaryImage from "@/posts/newsletter.webp";

const SUBSTACK_FEED_URL = "https://hydration.substack.com/feed";
const MAX_POSTS = 3;

export type Post = {
  title: string;
  preview: string;
  date: string;
  href: string;
  image: StaticImageData | string;
};

const fallbackPosts: Post[] = [
  {
    title: "Assume Breach: Hydration's Paranoid Security Model",
    preview:
      "A practical look at how Hydration approaches security with layered safeguards and damage containment.",
    date: "Apr 21, 2026",
    href: "https://hydration.substack.com/p/assume-breach-hydrations-paranoid",
    image: AssumeBreachImage,
  },
  {
    title: "Hydration Newsletter: Jan / Feb 2026",
    preview:
      "A compact progress recap covering Hydrated Strategy, GIGASOL, and the latest product work.",
    date: "Mar 20, 2026",
    href: "https://hydration.substack.com/p/hydration-newsletter-jan-feb-2026",
    image: JanuaryFebruaryImage,
  },
  {
    title: "The Hydrated Strategy",
    preview:
      "Revenue beyond the cycle, with a yield strategy built around real economic activity.",
    date: "Feb 5, 2026",
    href: "https://hydration.substack.com/p/the-hydrated-strategy",
    image: HydratedStrategyImage,
  },
];

const imageBySlug: Record<string, StaticImageData> = {
  "assume-breach-hydrations-paranoid": AssumeBreachImage,
  "hydration-newsletter-mar-apr-2026": MarchAprilNewsletterImage,
  "hydration-newsletter-jan-feb-2026": JanuaryFebruaryImage,
  "the-hydrated-strategy": HydratedStrategyImage,
};

export default async function RecentPostsSection() {
  const posts = await getRecentPosts();

  return <RecentPostsClient posts={posts} />;
}

async function getRecentPosts(): Promise<Post[]> {
  try {
    const response = await fetch(SUBSTACK_FEED_URL, {
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`Substack RSS returned ${response.status}`);
    }

    const xml = await response.text();
    const posts = parseSubstackFeed(xml);

    return posts.length > 0 ? posts : fallbackPosts;
  } catch (error) {
    console.warn("Failed to fetch Substack RSS feed:", error);
    return fallbackPosts;
  }
}

function parseSubstackFeed(xml: string): Post[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/g) ?? [];

  return items
    .map((item, index): Post | null => {
      const title = decodeEntities(stripCdata(getTagValue(item, "title")));
      const href = decodeEntities(stripCdata(getTagValue(item, "link")));
      const rawPreview =
        getTagValue(item, "description") ||
        getTagValue(item, "content:encoded");
      const preview = truncateText(
        decodeEntities(stripHtml(stripCdata(rawPreview))),
        120
      );
      const date = formatDate(stripCdata(getTagValue(item, "pubDate")));
      const slug = getPostSlug(href);
      const fetchedImage = getEnclosureImage(item);

      if (!title || !href || !slug) return null;

      return {
        title,
        preview: preview || "Read the latest update from the Hydration team.",
        date,
        href,
        image:
          imageBySlug[slug] ??
          fetchedImage ??
          fallbackPosts[index % fallbackPosts.length].image,
      } satisfies Post;
    })
    .filter((post): post is Post => Boolean(post))
    .slice(0, MAX_POSTS);
}

function getTagValue(item: string, tagName: string) {
  const escapedTagName = tagName.replace(":", "\\:");
  const match = item.match(
    new RegExp(`<${escapedTagName}[^>]*>([\\s\\S]*?)<\\/${escapedTagName}>`, "i")
  );

  return match?.[1]?.trim() ?? "";
}

function getEnclosureImage(item: string) {
  const match = item.match(/<enclosure\b[^>]*\surl=["']([^"']+)["'][^>]*>/i);
  return match?.[1] ? decodeEntities(match[1]) : undefined;
}

function getPostSlug(href: string) {
  try {
    const url = new URL(href);
    return url.pathname.split("/").filter(Boolean).pop() ?? "";
  } catch {
    return "";
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function stripCdata(value: string) {
  return value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeEntities(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength).trim().replace(/[.,;:!?-]+$/, "")}...`;
}
