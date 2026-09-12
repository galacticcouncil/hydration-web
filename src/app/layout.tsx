import SmoothScrolling from "@/components/smooth";
import "./globals.css";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { metadataBase: new URL(site.url) };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/font/geist/geist.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/font/gazpacho/Gazpacho-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/font/gazpacho/Gazpacho-Italic-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="alternate" type="text/markdown" href="/index.md" title="Hydration as Markdown" />
        <link rel="describedby" type="text/plain" href="/llms.txt" title="Hydration resources for agents" />
      </head>
      <body>
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}
