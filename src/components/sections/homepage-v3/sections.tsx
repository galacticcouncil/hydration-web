"use client";

import AnimateOnView from "@/animation/motion-section";
import { fadeUp, revealStagger, staggerChildren } from "@/animation/variants";
import HdxFlowLogo from "@/components/sections/built-to-be-unstoppable/assets/logo.svg";
import ArchFeatureCard from "@/components/sections/arch-feature-card";
import LockIcon from "@/components/sections/devs-and-security/icons/lock";
import DiscordLogo from "@/components/footer/assets/discord.svg";
import TelegramLogo from "@/components/footer/assets/telegram.svg";
import XLogo from "@/components/footer/assets/x.svg";
import {
  ProductiveAssetsIcon,
  StrategyNetworkIcon,
} from "@/components/sections/new-features/rwa-feature";
import Heading from "@/components/ui/typography/heading";
import Paragraph from "@/components/ui/typography/paragraph";
import SectionLabel from "@/components/ui/labels/section";
import DiamondIcon from "@/components/ui/labels/icons/diamond";
import { formatCompactMetric, useCapitalMetrics } from "./capital-metrics";
import StrategyAssetCloud from "./strategy-asset-cloud";
import IntegratedSystemRegular from "./integrated-system-regular";
import { motion, type Variants } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

const yieldPillars = [
  {
    title: "Productive assets",
    description:
      "Generate sustainable yield from assets backed by real economic activity rather than short-lived token emissions.",
    accent: "lavender",
    icon: <ProductiveAssetsIcon />,
  },
  {
    title: "Curated strategies",
    description:
      "Access strategies that combine productive assets with DeFi to improve capital efficiency and maximize risk-adjusted returns.",
    accent: "blue",
    icon: <StrategyNetworkIcon />,
  },
  {
    title: "Security first",
    description:
      "Protect capital through appchain-native security, invariant enforcement, circuit breakers, audits, continuous testing, and layered protocol controls.",
    accent: "green",
    icon: <LockIcon className="h-[68px] w-[60px]" />,
  },
] as const;

const sectionFillFade: Variants = {
  initial: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] },
  },
};

const stationarySectionReveal = (staggerChildren: number): Variants => ({
  initial: {},
  visible: {
    transition: { staggerChildren },
  },
});

const hdxBenefits = [
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

export function CapitalAtWorkSection() {
  const capitalMetrics = useCapitalMetrics();

  return (
    <AnimateOnView
      className="bg-purple px-6 py-5 text-white md:px-[50px] md:pb-10 md:pt-2 lg:pb-12 lg:pt-0 xl:px-0"
      variants={revealStagger(0.08, 12)}
      threshold={0.08}
    >
      <div
        id="capital"
        className="container relative z-20 mx-auto scroll-mt-32 max-xl:!px-0 lg:-mt-12 lg:scroll-mt-36"
      >
        <motion.div
          className="mx-auto flex w-full min-w-0 max-w-[64rem] flex-col items-center text-center"
          variants={fadeUp(10)}
        >
          <h2 className="w-full min-w-0 font-gazpacho text-base font-medium leading-none tracking-tight text-lavender md:text-[1.125rem]">
            Capital at work
          </h2>
        </motion.div>

        <motion.div
          className="mt-1 grid md:mt-1.5 lg:mt-1.5 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerChildren(0.1)}
        >
          {capitalMetrics.map((metric) => (
            <CapitalMetricCard key={metric.title} metric={metric} />
          ))}
        </motion.div>
      </div>
    </AnimateOnView>
  );
}

function CapitalMetricCard({
  metric,
}: {
  metric: {
    title: string;
    value: number | null;
    prefix: "" | "$";
  };
}) {
  const hasLiveValue = metric.value !== null && Number.isFinite(metric.value);
  const displayValue = formatCompactMetric(metric.value, metric.prefix);

  return (
    <motion.article
      className="group relative flex min-h-[6.5rem] flex-col justify-end px-1 py-2 md:min-h-[6.25rem] md:px-6 md:py-3 lg:min-h-[6rem] lg:px-8 lg:py-3 lg:first:pl-0 lg:last:pr-0"
      variants={fadeUp(16)}
    >
      <div>
        <p className="font-gazpacho text-[2.65rem] font-medium leading-none tracking-tight text-white lg:text-[3rem]">
          {hasLiveValue ? displayValue : "—"}
        </p>
        <h3 className="mt-2 whitespace-nowrap font-gazpacho text-base font-medium leading-none tracking-tight text-lavender transition-colors group-hover:text-white lg:text-[1.1rem]">
          {metric.title}
        </h3>
      </div>
    </motion.article>
  );
}

export function ProductiveYieldSection() {
  return (
    <AnimateOnView
      className="bg-beige bg-[url('/square.svg')] bg-repeat px-6 py-16 md:px-[50px] lg:py-28 xl:px-0"
      variants={revealStagger(0.1, 18)}
      style={{
        backgroundSize: "clamp(4.375rem, 0.804rem + 8.929vi, 9.375rem)",
      }}
      threshold={0.12}
      viewportMargin="0px 0px -10% 0px"
    >
      <section
        id="productive-yield"
        className="container mx-auto scroll-mt-24 max-xl:!px-0 lg:scroll-mt-28"
      >
        <motion.div
          className="mx-auto flex max-w-[54rem] flex-col items-center text-center"
          variants={fadeUp(14)}
        >
          <SectionLabel captionClassName="text-pink" iconClassName="bg-pink">
            Productive yield
          </SectionLabel>
          <Heading size="large" className="mt-5 text-balance text-purple">
            Real-world yield, enhanced by DeFi
          </Heading>
          <Paragraph
            size="large"
            className="mt-6 max-w-[48rem] text-balance text-purple-dim"
          >
            Hydration turns productive onchain assets into accessible yield
            opportunities, combining durable sources of return with the
            efficiency and composability of DeFi.
          </Paragraph>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-8"
          initial="initial"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16, margin: "0px 0px -8% 0px" }}
          variants={revealStagger(0.13, 28)}
        >
          {yieldPillars.map((pillar) => (
            <ArchFeatureCard
              key={pillar.title}
              title={pillar.title}
              description={pillar.description}
              accent={pillar.accent}
              icon={pillar.icon}
            />
          ))}
        </motion.div>
      </section>
    </AnimateOnView>
  );
}

export function StrategiesSection() {
  return (
    <AnimateOnView
      className="overflow-hidden bg-white py-20 lg:py-32"
      variants={revealStagger(0.1, 18)}
      threshold={0.12}
      viewportMargin="0px 0px -10% 0px"
    >
      <section
        id="strategies"
        className="container mx-auto scroll-mt-24 px-6 md:px-[50px] lg:scroll-mt-28 xl:px-16"
      >
        <motion.div
          className="grid gap-7"
          variants={fadeUp(14)}
        >
          <Heading
            size="large"
            animationVariants={fadeUp(14)}
            className="max-w-[24ch] text-balance text-purple lg:text-[3.25rem] lg:leading-tight"
          >
            Put your capital to work
          </Heading>
          <div className="max-w-[54rem]">
            <Paragraph size="large" className="text-purple/65">
              Explore strategies built around the opportunities available across
              Hydration — from earning yield and providing liquidity to borrowing,
              looping, and more active capital management.
            </Paragraph>
            <Paragraph size="large" className="mt-4 text-purple/65">
              Browse different ways to deploy your assets, understand how each
              strategy works, and choose the level of complexity and risk that
              suits you.
            </Paragraph>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 min-w-0 lg:mt-20"
          variants={fadeUp(14)}
        >
          <StrategyAssetCloud />
        </motion.div>
      </section>
    </AnimateOnView>
  );
}

const integratedSectionReveal: Variants = {
  initial: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.333, 0, 0, 1],
      staggerChildren: 0.055,
    },
  },
};

export function IntegratedSystemSection() {
  return (
    <AnimateOnView
      className="bg-beige pb-6 pt-16 lg:pb-0 lg:pt-0"
      variants={integratedSectionReveal}
      threshold={0.06}
      viewportMargin="0px 0px 4% 0px"
    >
      <section
        id="why-hydration"
        className="container mx-auto scroll-mt-24 px-6 md:px-[50px] lg:scroll-mt-28 xl:px-16"
      >
        <IntegratedSystemRegular />
      </section>
    </AnimateOnView>
  );
}

function formatMetricValue(value: number) {
  if (value >= 1_000_000) {
    return `${Math.round(value / 1_000_000)}M`;
  }

  if (value >= 10_000) {
    return `${Math.round(value / 1_000)}K`;
  }

  return Math.round(value).toString();
}

export function HdxSection() {
  return (
    <AnimateOnView
      element="div"
      className="relative px-6 py-16 md:px-[50px] lg:py-28 xl:px-0"
      variants={stationarySectionReveal(0.08)}
      threshold={0.1}
      viewportMargin="0px 0px -10% 0px"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-lavender"
        variants={sectionFillFade}
      />
      <section
        id="hdx"
        className="container relative mx-auto scroll-mt-24 max-xl:!px-0 lg:scroll-mt-28"
      >
        <motion.div
          className="mx-auto flex max-w-[64rem] flex-col items-center text-center"
          variants={fadeUp(14)}
        >
          <Heading
            size="large"
            className="max-w-[18ch] text-balance text-[2.55rem] leading-[1.08] text-purple md:text-5xl md:leading-[1.2]"
          >
            Powered by HDX
          </Heading>
          <div className="mt-7 max-w-[36.1rem] space-y-7 text-balance text-purple/65 lg:mt-8">
            <Paragraph size="large" className="leading-7">
              HDX connects protocol growth, governance participation, and value
              distribution across the Hydration ecosystem.
            </Paragraph>
            <Paragraph size="large" className="leading-7">
              As Hydration generates more revenue, expands its strategies, and
              attracts more capital, HDX holders help decide how that value is
              used and distributed.
            </Paragraph>
          </div>
          <h3 className="mt-8 font-gazpacho text-[1.7rem] font-medium leading-[1.05] text-pink md:text-[1.8125rem] md:leading-[1.035]">
            Why hodl HDX
          </h3>
        </motion.div>

        <motion.div
          className="relative mx-auto mt-16 hidden max-w-[75rem] lg:block"
          initial="initial"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16, margin: "0px 0px -8% 0px" }}
          variants={revealStagger(0.1, 26)}
        >
          <div className="absolute left-[16.667%] right-1/2 top-0 h-px bg-pink" />
          <div className="absolute left-1/2 right-[15.833%] top-0 h-px bg-pink" />
          <div className="absolute left-1/2 top-0 z-20 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-pink bg-lavender">
            <Image
              src={HdxFlowLogo}
              width={68}
              height={68}
              alt="HDX at the center of Hydration governance"
              className="h-[4.25rem] w-[4.25rem]"
            />
          </div>

          <div className="grid grid-cols-4">
            {hdxBenefits.map((benefit, index) => (
              <motion.article
                key={benefit.title}
                className="flex min-w-0 flex-col items-center text-center"
                variants={fadeUp(18)}
              >
                <div
                  className={
                    index === 0
                      ? "relative h-24 w-1/2 self-end rounded-tl-[2.5rem] border-l border-t border-pink"
                      : index === hdxBenefits.length - 1
                        ? "relative h-24 w-1/2 self-start rounded-tr-[2.5rem] border-r border-t border-pink"
                        : "relative h-24 w-px bg-pink"
                  }
                >
                  <DiamondIcon
                    className={
                      index === 0
                        ? "absolute -bottom-1 -left-[0.3rem] h-2.5 w-2.5 bg-pink"
                        : index === hdxBenefits.length - 1
                          ? "absolute -bottom-1 -right-[0.3rem] h-2.5 w-2.5 bg-pink"
                          : "absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 bg-pink"
                    }
                  />
                </div>
                <h3 className="mt-6 max-w-[13ch] text-balance font-gazpacho text-[1.75rem] font-medium leading-[1.02] text-purple xl:text-[2rem]">
                  {benefit.title}
                </h3>
                <Paragraph
                  size="medium"
                  className="mt-5 max-w-[17rem] text-balance leading-relaxed text-purple/60"
                >
                  {benefit.description}
                </Paragraph>
              </motion.article>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 max-w-[34rem] lg:hidden"
          initial="initial"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1, margin: "0px 0px -8% 0px" }}
          variants={revealStagger(0.1, 24)}
        >
          <div className="ml-px flex items-center gap-4">
            <Image
              src={HdxFlowLogo}
              width={60}
              height={60}
              alt="HDX at the center of Hydration governance"
              className="h-[3.75rem] w-[3.75rem] shrink-0"
            />
            <div className="h-px flex-1 bg-pink/40" />
          </div>
          <div className="ml-9 border-l border-pink/40 pb-1 pt-9">
            {hdxBenefits.map((benefit, index) => (
              <motion.article
                key={benefit.title}
                className={
                  index === 0 ? "relative pl-9" : "relative mt-10 pl-9"
                }
                variants={fadeUp(18)}
              >
                <div className="absolute left-0 top-2 h-px w-6 bg-pink/40" />
                <DiamondIcon className="absolute left-[1.5rem] top-[0.3rem] h-2 w-2 -translate-x-1/2 bg-pink" />
                <h3 className="max-w-[16ch] text-balance font-gazpacho text-[1.75rem] font-medium leading-[1.04] text-purple">
                  {benefit.title}
                </h3>
                <Paragraph
                  size="medium"
                  className="mt-3 max-w-[29rem] leading-relaxed text-purple/60"
                >
                  {benefit.description}
                </Paragraph>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>
    </AnimateOnView>
  );
}

export function CommunityBuildSection() {
  return (
    <AnimateOnView
      element="div"
      className="relative overflow-hidden border-t border-white/10 bg-purple text-white"
      variants={stationarySectionReveal(0.1)}
      threshold={0.08}
      viewportMargin="0px 0px -10% 0px"
    >
      <section id="community" className="relative scroll-mt-24 lg:scroll-mt-28">
        <div className="grid min-h-[56rem] lg:min-h-[58rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(34rem,0.95fr)]">
          <motion.div
            className="flex items-center px-6 py-20 md:px-[50px] lg:px-[max(50px,calc((100vw-83rem)/2+4rem))] lg:py-28 lg:pr-16 xl:pr-24"
            variants={fadeUp(14)}
          >
            <motion.div className="max-w-[48rem]" variants={fadeUp(10)}>
              <SectionLabel
                captionClassName="text-lavender"
                iconClassName="bg-pink"
              >
                Community
              </SectionLabel>
              <h2 className="mt-7 max-w-[17ch] text-balance font-gazpacho text-[2.4rem] font-normal leading-[1.04] text-white md:text-[3rem] lg:text-[3.25rem]">
                Built and governed by the community
              </h2>
              <Paragraph
                size="large"
                className="mt-8 max-w-[39rem] text-white/65"
              >
                Hydration is shaped by an open community of users, contributors,
                liquidity providers, and HDX holders.
              </Paragraph>
              <Paragraph
                size="large"
                className="mt-4 max-w-[39rem] text-white/65"
              >
                Together, they govern the protocol, allocate resources,
                distribute value, and build a more secure and productive home
                for onchain capital.
              </Paragraph>
              <p className="mt-10 font-gazpacho text-[1.5rem] font-medium leading-none text-lavender md:text-[1.65rem]">
                Join the Community
              </p>
              <motion.div
                className="mt-6 grid gap-2 sm:grid-cols-3"
                variants={staggerChildren(0.09)}
              >
                <CommunityLink
                  href="https://x.com/hydration_net"
                  name="Twitter"
                  icon={XLogo}
                  className="bg-lavender"
                />
                <CommunityLink
                  href="https://discord.gg/kkmY35UxAG"
                  name="Discord"
                  icon={DiscordLogo}
                  className="bg-blue"
                />
                <CommunityLink
                  href="https://t.me/hydration_net"
                  name="Telegram"
                  icon={TelegramLogo}
                  className="bg-green"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative min-h-[32rem] border-t border-white/15 bg-white/[0.035] lg:min-h-full lg:border-l lg:border-t-0"
            variants={fadeUp(20)}
          >
            <ConstructionDrawing />
          </motion.div>
        </div>
      </section>
    </AnimateOnView>
  );
}

function ConstructionDrawing() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* The SVG contains the exact supplied architectural linework and its
          own reduced-motion-aware redraw cycle. */}
      <Image
        src="/build-architecture-lines.svg"
        alt=""
        fill
        unoptimized
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="scale-[1.04] object-cover object-[72%_center] opacity-90"
      />
    </div>
  );
}

function CommunityLink({
  href,
  name,
  icon,
  className,
}: {
  href: string;
  name: string;
  icon: StaticImageData;
  className: string;
}) {
  return (
    <motion.div variants={fadeUp(14)}>
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open Hydration on ${name}`}
        className={`${className} group flex min-h-[4.25rem] items-center justify-center rounded-full px-5 py-3 text-purple transition-transform duration-200 ease-out hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
      >
        <span className="flex items-center gap-3">
          <Image
            src={icon}
            alt=""
            width={28}
            height={28}
            className="h-7 w-auto"
          />
          <span className="font-geist text-base font-medium">{name}</span>
        </span>
      </Link>
    </motion.div>
  );
}
