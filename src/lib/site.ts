export const site = {
  name: "Hydration",
  // This is the existing production identity, not a preview deployment URL.
  url: "https://hydration.net",
  title: "Hydration | A secure home for onchain capital",
  description: "Hydration unites swaps, lending and the HOLLAR stablecoin on one DeFi appchain, with productive assets, curated strategies and appchain-native security.",
  app: "https://app.hydration.net",
  docs: "https://docs.hydration.net/",
  explorer: "https://hydration-explorer.neckwork.net",
  github: "https://github.com/galacticcouncil",
  socials: [
    "https://x.com/hydration_net",
    "https://discord.gg/kkmY35UxAG",
    "https://t.me/hydration_net",
    "https://hydration.substack.com/",
  ],
} as const;

export const siteUrl = (path: string) => new URL(path, site.url).href;
