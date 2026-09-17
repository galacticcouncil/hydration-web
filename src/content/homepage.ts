// Shared by the visual homepage and its machine-readable representation.
export const homepageCopy = {
  "hero": {
    "title": "A secure home for your onchain capital.",
    "paragraphs": [
      "Earn sustainable yield through strategies built on productive assets, enhanced by DeFi, and protected by cutting-edge security."
    ]
  },
  "productive": {
    "id": "productive-yield",
    "title": "Real-world yield, enhanced by DeFi",
    "paragraphs": [
      "Hydration turns productive onchain assets into accessible yield opportunities, combining durable sources of return with the efficiency and composability of DeFi."
    ]
  },
  "strategies": {
    "id": "strategies",
    "title": "Put your capital to work",
    "paragraphs": [
      "Explore strategies built around the opportunities available across Hydration — from earning yield and providing liquidity to borrowing, looping, and more active capital management.",
      "Browse different ways to deploy your assets, understand how each strategy works, and choose the level of complexity and risk that suits you."
    ]
  },
  "why": {
    "id": "why-hydration",
    "title": "Why Hydration Is Different",
    "paragraphs": [
      "Most DeFi protocols depend on external infrastructure they cannot fully control. Hydration owns the full DeFi stack.",
      "By combining execution, liquidity, lending, stablecoins, oracles, and security at the appchain level, Hydration can coordinate products more efficiently and protect users at every layer."
    ]
  },
  "integrated": {
    "title": "One integrated financial system",
    "paragraphs": [
      "Hydration’s products are designed to work together rather than operate as isolated applications.",
      "Capital can move efficiently between strategies, borrowing markets, liquidity, and HOLLAR without relying on fragmented external infrastructure."
    ]
  },
  "appchain": {
    "title": "Appchain-level execution",
    "paragraphs": [
      "Owning the execution environment allows Hydration to optimize how financial activity is processed. This includes:"
    ]
  },
  "security": {
    "id": "security",
    "title": "Security without compromise",
    "paragraphs": [
      "Hydration is built around a simple principle: assume that every layer can fail.",
      "Instead of relying on a single line of defense, the protocol uses multiple independent protections across governance, infrastructure, execution, and product design."
    ]
  },
  "hdx": {
    "id": "hdx",
    "title": "Powered by HDX",
    "paragraphs": [
      "HDX connects protocol growth, governance participation, and value distribution across the Hydration ecosystem.",
      "As Hydration generates more revenue, expands its strategies, and attracts more capital, HDX holders help decide how that value is used and distributed."
    ]
  },
  "community": {
    "id": "community",
    "title": "Built and governed by the community",
    "paragraphs": [
      "Hydration is shaped by an open community of users, contributors, liquidity providers, and HDX holders.",
      "Together, they govern the protocol, allocate resources, distribute value, and build a more secure and productive home for onchain capital."
    ]
  }
} as const;

export const hdxBenefits = [
  {
    title: "Participate in governance",
    description:
      "Vote on protocol upgrades, treasury deployment, risk parameters, incentives, and the future direction of Hydration.",
  },
  {
    title: "Earn through staking",
    description:
      "Stake HDX to participate in governance, strengthen long-term alignment, and become eligible for protocol incentives and revenue distribution.",
  },
  {
    title: "Share in protocol growth",
    description:
      "Benefit from mechanisms that redirect protocol revenue toward aligned HDX holders and long-term ecosystem participants.",
  },
  {
    title: "Influence capital allocation",
    description:
      "Help determine how treasury capital, incentives, and protocol-owned liquidity are deployed across strategies and markets.",
  },
] as const;

export const appchainFeatures = [
  { label: "Onchain oracle updates" },
  { label: "Transaction prioritization" },
  { label: "Prioritized and partial liquidations" },
  { label: "Protocol-wide risk controls" },
  { label: "Security enforced at the runtime level" },
] as const;

export const securityGroups = [
  {
    title: "Authority & access",
    icon: "/assets/security-authority.svg",
    mechanisms: [
      "Onchain governance as the ultimate decision-making and authorization layer (no msigs)",
      "Fine-grained protocol permissions",
      "Appchain-native security controls",
    ],
  },
  {
    title: "Exposure boundaries",
    icon: "/assets/security-exposure.svg",
    mechanisms: [
      "Per-asset transaction pausing",
      "Per-asset deposit, withdrawal, borrowing, and exposure limits",
      "Asset and contract whitelisting",
    ],
  },
  {
    title: "Runtime safeguards",
    icon: "/assets/security-runtime.svg",
    mechanisms: [
      "Invariant enforcement",
      "Automated circuit breakers",
      "Prioritized and partial liquidations",
      "Onchain oracle updates",
    ],
  },
  {
    title: "Continuous assurance",
    icon: "/assets/security-assurance.svg",
    mechanisms: [
      "Independent security audits",
      "Continuous fuzzing",
      "AI-assisted security analysis",
      "A top-10 Immunefi bug bounty program",
    ],
  },
] as const;

export const yieldPillarCopy = [
  {
    "title": "Productive assets",
    "description": "Generate sustainable yield from assets backed by real economic activity rather than short-lived token emissions."
  },
  {
    "title": "Curated strategies",
    "description": "Access strategies that combine productive assets with DeFi to improve capital efficiency and maximize risk-adjusted returns."
  },
  {
    "title": "Security first",
    "description": "Protect capital through appchain-native security, invariant enforcement, circuit breakers, audits, continuous testing, and layered protocol controls."
  }
] as const;

export const strategyOpportunities = [
  "Provide ETH liquidity",
  "Borrow HOLLAR",
  "Earn with HOLLAR Bonds",
  "Provide DOT liquidity",
  "Earn with BIL",
  "Provide Omnipool liquidity",
  "Provide stablecoin liquidity",
  "Borrow against BIL"
] as const;
