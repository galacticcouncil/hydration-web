import { homepageCopy, yieldPillarCopy, hdxBenefits, appchainFeatures, securityGroups, strategyOpportunities } from "../content/homepage";
import { site, siteUrl } from "./site";

type CopySection = { title: string; paragraphs: readonly string[] };
const section = (copy: CopySection, level = 2) => `${"#".repeat(level)} ${copy.title}\n\n${copy.paragraphs.join("\n\n")}`;
const list = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");

export function homepageMarkdown() {
  return [
    `# Hydration\n\n> ${site.description}\n\n[Homepage](${siteUrl("/")}) · [Launch the app](${site.app}) · [Documentation](${site.docs})`,
    section(homepageCopy.hero),
    section(homepageCopy.productive),
    ...yieldPillarCopy.map((pillar) => `### ${pillar.title}\n\n${pillar.description}`),
    section(homepageCopy.strategies),
    list(strategyOpportunities),
    section(homepageCopy.why),
    section(homepageCopy.integrated, 3),
    section(homepageCopy.appchain, 3),
    list(appchainFeatures.map(({ label }) => label)),
    section(homepageCopy.security),
    ...securityGroups.map((group) => `### ${group.title}\n\n${list(group.mechanisms)}`),
    section(homepageCopy.hdx),
    ...hdxBenefits.map((benefit) => `### ${benefit.title}\n\n${benefit.description}`),
    section(homepageCopy.community),
    `## Official resources\n\n${list([
      `[Hydration app](${site.app}): Strategies, swaps, lending and borrowing.`,
      `[Hydration documentation](${site.docs}): Product mechanics and technical documentation.`,
      `[Hydration Explorer](${site.explorer}): Network data and protocol analytics.`,
      `[Source code](${site.github}): Open-source repositories.`,
      ...site.socials.map((url) => `[Community](${url})`),
    ])}`,
  ].join("\n\n") + "\n";
}

export function llmsText() {
  return `# Hydration

> ${site.description}

This website explains Hydration. Trading, lending and wallet actions take place in the separate Hydration app.

## Landing page

- [Homepage as Markdown](${siteUrl("/index.md")}): Products, strategies, appchain architecture, security, HDX and community. Main content from the visual landing page, without animations.
- [Homepage](${siteUrl("/")}): The visual landing page. Request it with Accept: text/markdown for the Markdown representation, or use the explicit Markdown URL above.

## Official resources

- [Hydration app](${site.app}): Product access and wallet interactions.
- [Hydration documentation](${site.docs}): Product mechanics and developer documentation.
- [Hydration Explorer](${site.explorer}): Chain activity and protocol analytics.
- [Hydration source code](${site.github}): Open-source repositories.
`;
}

export function homepageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": siteUrl("/#organization"), name: site.name,
        url: siteUrl("/"), logo: siteUrl("/icon.png"), sameAs: [site.github, ...site.socials] },
      { "@type": "WebSite", "@id": siteUrl("/#website"), name: site.name, url: siteUrl("/"),
        inLanguage: "en", publisher: { "@id": siteUrl("/#organization") } },
      { "@type": "WebPage", "@id": siteUrl("/#webpage"), url: siteUrl("/"), name: site.title,
        description: site.description, inLanguage: "en", isPartOf: { "@id": siteUrl("/#website") },
        about: { "@id": siteUrl("/#organization") },
        hasPart: [homepageCopy.productive, homepageCopy.strategies, homepageCopy.why, homepageCopy.security, homepageCopy.hdx, homepageCopy.community].map((copy) => ({
          "@type": "WebPageElement", "@id": siteUrl(`/#${copy.id}`), name: copy.title,
          description: copy.paragraphs.join(" "),
        })),
      },
    ],
  };
}
