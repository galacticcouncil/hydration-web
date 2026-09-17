import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import HeroSection from "@/components/sections/hero/section";
import { getCachedCapitalMetrics } from "@/api/capital-metrics.cached";
import SecurityFeature from "@/components/sections/new-features/security-feature";
import {
  CommunityBuildSection,
  HdxSection,
  IntegratedSystemSection,
  ProductiveYieldSection,
  StrategiesSection,
} from "@/components/sections/homepage-v3/sections";
import { Metadata } from "next";
import { homepageStructuredData } from "@/lib/agent-content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
      url: "/favicon-16x16.png",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
      url: "/site.webmanifest",
    },
    {
      rel: "mask-icon",
      href: "/safari-pinned-tab.svg",
      color: "#e53e76",
      url: "/safari-pinned-tab.svg",
    },
  ],
  //   <meta name="theme-color" content="#F6F6EC">
  // <meta name="msapplication-navbutton-color" content="#F6F6EC">
  // <meta name="apple-mobile-web-app-capable" content="yes"/>
  // <meta name="apple-mobile-web-app-status-bar-style" content="#F6F6EC"></meta>
  other: {
    "msapplication-TileColor": "#ff0000",
    "theme-color": "#ffffff",
    "color-scheme": "only light",
    "msapplication-navbutton-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar": "#ffffff",
    "apple-mobile-web-app-status-bar-style": "#ffffff",
  },
  metadataBase: new URL("https://hydration.net"),
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
    images: [
      {
        url: "https://hydration.net/opengraph-image.jpg",
        protocol: "https",
        hostname: "hydration.net",
        width: 1200,
        height: 627,
        alt: "Hydration | A secure home for onchain capital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@hydration_net",
    title: site.title,
    description: site.description,
    images: [
      {
        url: "https://hydration.net/twitter-image.png",
        protocol: "https",
        hostname: "hydration.net",
        width: 1200,
        height: 627,
        alt: "Hydration | A secure home for onchain capital",
      },
    ],
  },
};

export const revalidate = 60;

export default async function Home() {
  const { metrics } = await getCachedCapitalMetrics();

  return (
    <main className="bg-white-100 overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData()).replace(/</g, "\\u003c") }} />
      <noscript>
        <style>{`
          main [style*="opacity:0"], main [data-reveal], main .reveal-on-view {
            opacity: 1 !important; filter: none !important;
          }
          [data-animated-heading] [style] { opacity: 1 !important; transform: none !important; }
          [data-homepage-hero] { height: auto !important; min-height: 0 !important; }
          [data-homepage-hero] > div { position: relative !important; height: auto !important; }
          [data-hero-intro], [data-hero-scene], #capital { position: relative !important; height: auto !important; }
          [data-hero-scene] { height: 32rem !important; clip-path: none !important; }
          [data-hero-background] { display: none !important; }
          [data-hero-intro] { padding-top: 8rem !important; }
        `}</style>
      </noscript>
      <Header className="fixed top-0 left-0 right-0 xl:top-4" />
      <HeroSection initialMetrics={metrics} />
      <noscript>
        <p className="bg-beige px-6 pb-8 text-center font-geist text-sm text-purple">
          <a className="underline" href="/index.md">Read this page as plain Markdown</a>.
        </p>
      </noscript>
      <ProductiveYieldSection />
      <StrategiesSection />
      <IntegratedSystemSection />
      <SecurityFeature />
      <HdxSection />
      <CommunityBuildSection />
      <Footer />
    </main>
  );
}
