"use client";

import {
  formatCompactMetric,
  type CapitalMetric,
  useCapitalMetrics,
} from "@/components/sections/homepage-v3/capital-metrics";
import Paragraph from "@/components/ui/typography/paragraph";
import Socials from "@/components/footer/socials";
import SupportingBadge from "@/components/badges/supportingBadge";
import { HeroLaunchAppButton } from "@/components/header/launch-app-button";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionStyle, MotionValue } from "framer-motion";
import useScreenSize from "@/hooks/useScreenSize";
import Image from "next/image";
import HeroWaterCanvas from "./water-canvas";
import { useEffect, useRef, useState } from "react";

const headlineEase = [0.2, 0.65, 0.3, 0.9] as const;
const beigeShaderColor = [246 / 255, 246 / 255, 236 / 255] as const;
const metricRevealEase = (value: number) => 1 - Math.pow(1 - value, 3);
// Preserved for another pass: progressively feathers the real scene container
// while it expands, without introducing a duplicate blurred background.
const sceneEdgeFeatherEnabled = false;

export default function HeroSection() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { width: viewportWidth, height: viewportHeight } = useScreenSize();
  const mobileLayout = viewportWidth < 1024;
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const sceneClip = useTransform(
    scrollYProgress,
    [0, 0.16],
    [
      "inset(66vh 7vw 0vh 7vw round 2.75rem 2.75rem 0rem 0rem)",
      "inset(0vh 0vw 0vh 0vw round 0rem 0rem 0rem 0rem)",
    ],
  );
  const sceneMaskTop = useTransform(
    scrollYProgress,
    [0, 0.16],
    ["66vh", "0vh"],
  );
  const sceneMaskSide = useTransform(
    scrollYProgress,
    [0, 0.16],
    ["7vw", "0vw"],
  );
  const sceneMaskEdgeAlpha = useTransform(
    scrollYProgress,
    [0, 0.03, 0.115, 0.16],
    [1, 0, 0, 1],
  );
  const sceneFeatherMask = useMotionTemplate`linear-gradient(to bottom, rgba(0, 0, 0, ${sceneMaskEdgeAlpha}) ${sceneMaskTop}, black calc(${sceneMaskTop} + 26px), black calc(100% - 20px), rgba(0, 0, 0, ${sceneMaskEdgeAlpha}) 100%), linear-gradient(to right, rgba(0, 0, 0, ${sceneMaskEdgeAlpha}) ${sceneMaskSide}, black calc(${sceneMaskSide} + 22px), black calc(100% - ${sceneMaskSide} - 22px), rgba(0, 0, 0, ${sceneMaskEdgeAlpha}) calc(100% - ${sceneMaskSide}))`;
  const sceneFillOpacity = useTransform(scrollYProgress, [0, 0.16], [0, 1]);
  const sceneTransitionHeight = useTransform(
    scrollYProgress,
    [0, 0.14, 0.22],
    [0, 0, 72],
  );
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.13]);
  const heroContentShift = Math.min(
    56,
    14 + Math.max(0, (viewportHeight - 720) * 0.072),
  );
  const heroContentY = useTransform(
    scrollYProgress,
    [0, 0.32, 0.68],
    [14, 14, heroContentShift],
  );
  const introChromeOpacity = useTransform(scrollYProgress, [0.06, 0.23], [1, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.22, 0.36], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.22, 0.4], [42, 0]);

  return (
    <section
      ref={sceneRef}
      data-homepage-hero
      className="relative z-10 bg-beige lg:h-[165vh] lg:min-h-[86rem]"
    >
      <div className="relative flex flex-col overflow-hidden lg:sticky lg:top-0 lg:block lg:h-screen">
        <motion.div
          className="pointer-events-none relative z-20 flex items-center px-6 pb-12 pt-28 md:px-[50px] lg:absolute lg:inset-x-0 lg:top-0 lg:h-[66vh] lg:min-h-[34rem] lg:pb-0 lg:pt-20 xl:px-16"
          style={{ y: reducedMotion || mobileLayout ? 0 : heroContentY }}
        >
          <div className="container relative mx-auto flex min-w-0 justify-center max-xl:!px-0">
            <HeroSectionContent />
          </div>
        </motion.div>
        <motion.div
          className="invisible absolute inset-0 z-[9] overflow-hidden bg-beige lg:visible"
          style={{ opacity: reducedMotion ? 0 : sceneFillOpacity }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0"
            style={{ scale: reducedMotion ? 1 : sceneScale }}
          >
            <Image
              src="/assets/hero-arches-sunset-wide.webp"
              alt=""
              fill
              priority
              fetchPriority="high"
              quality={74}
              sizes="100vw"
              className="object-cover object-[54%_center]"
            />
            <div
              className="pointer-events-none absolute inset-0 z-[7] bg-[url('/noise.svg')] bg-repeat opacity-20 mix-blend-multiply grayscale"
              style={{ backgroundSize: "640px 640px" }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 mx-[7vw] h-[22rem] isolate overflow-hidden rounded-t-[2.75rem] bg-beige max-lg:![clip-path:none] sm:h-[28rem] lg:absolute lg:inset-0 lg:mx-0 lg:h-auto lg:rounded-none"
          style={{
            clipPath: reducedMotion
              ? "inset(66vh 7vw 0 7vw round 2.75rem 2.75rem 0 0)"
              : sceneClip,
            maskImage:
              sceneEdgeFeatherEnabled && !reducedMotion
                ? sceneFeatherMask
                : undefined,
            WebkitMaskImage:
              sceneEdgeFeatherEnabled && !reducedMotion
                ? sceneFeatherMask
                : undefined,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ scale: reducedMotion || mobileLayout ? 1 : sceneScale }}
          >
            <motion.div
              className="absolute inset-0 will-change-transform"
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.55,
                duration: 1.05,
                ease: headlineEase,
              }}
            >
              <div
                className="absolute inset-0 overflow-hidden"
                aria-hidden="true"
              >
                <Image
                  src="/assets/hero-arches-sunset-wide.webp"
                  alt=""
                  fill
                  loading="lazy"
                  quality={74}
                  sizes="(max-width: 1023px) 86vw, 100vw"
                  className="object-cover object-[54%_center]"
                />
              </div>
              <HeroWaterCanvas
                className="hero-water-camera"
                showCapitalBand
                transitionColor={beigeShaderColor}
                transitionHeightPx={sceneTransitionHeight}
              />
              <div
                className="pointer-events-none absolute inset-0 z-[7] bg-[url('/noise.svg')] bg-repeat opacity-20 mix-blend-multiply grayscale"
                style={{ backgroundSize: "640px 640px" }}
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-8 z-20 mx-auto px-4 lg:px-[8vw]"
            style={{
              opacity: reducedMotion || mobileLayout ? 1 : introChromeOpacity,
            }}
          >
            <motion.div
              className="flex w-full flex-col items-center gap-5 lg:flex-row lg:justify-between lg:gap-0"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.18,
                duration: 0.7,
                ease: headlineEase,
              }}
            >
              <Socials />
              <SupportingBadge />
            </motion.div>
          </motion.div>
        </motion.div>

        <HeroCapitalStats
          progress={scrollYProgress}
          staticValues={mobileLayout}
          style={{
            opacity: reducedMotion || mobileLayout ? 1 : statsOpacity,
            y: reducedMotion || mobileLayout ? 0 : statsY,
          }}
        />
      </div>
    </section>
  );
}

function HeroSectionContent() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-auto flex min-w-0 w-full flex-col items-center gap-8 lg:pb-[100px] lg:pt-[150px]">
      <motion.h1 className="w-full max-w-[19ch] min-w-0 text-balance text-center font-gazpacho text-[clamp(2.35rem,11.25vw,2.75rem)] font-medium leading-[0.92] text-purple sm:text-[clamp(2.75rem,7.3vw,5.5rem)] xl:text-[88px]">
        <span className="sm:hidden">
          <AnimatedHeadlineText text="A secure" />
          <br />
          <AnimatedHeadlineText delay={0.12} text="home for" />
          <br />
          <span className="font-normal italic text-[#240E32]">
            <AnimatedHeadlineText delay={0.24} text="your onchain" />
            <br />
            <AnimatedHeadlineText delay={0.38} text="capital." />
          </span>
        </span>
        <span className="hidden sm:inline">
          <AnimatedHeadlineText text="A secure home for" />
          <br />
          <span className="font-normal italic text-[#240E32]">
            <AnimatedHeadlineText delay={0.32} text="your onchain capital." />
          </span>
        </span>
      </motion.h1>
      <motion.div
        className="w-full"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.94, duration: 0.65, ease: headlineEase }}
      >
        <Paragraph
          size="large"
          className="mx-auto w-full max-w-[46rem] min-w-0 text-balance text-center text-[20px] leading-[1.25] text-purple lg:text-[24px]"
        >
          Earn sustainable yield through strategies built on productive assets,
          enhanced by DeFi, and protected by cutting-edge security.
        </Paragraph>
      </motion.div>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.08, duration: 0.65, ease: headlineEase }}
      >
        <HeroLaunchAppButton />
      </motion.div>
    </div>
  );
}

function HeroCapitalStats({
  progress,
  style,
  staticValues = false,
}: {
  progress: MotionValue<number>;
  style: MotionStyle;
  staticValues?: boolean;
}) {
  const metrics = useCapitalMetrics("allTime");

  return (
    <motion.div
      id="capital"
      className="relative z-30 flex flex-col justify-end bg-transparent px-6 py-10 text-purple md:px-[50px] lg:absolute lg:inset-x-0 lg:bottom-0 lg:min-h-[40vh] lg:pb-[7vh] lg:pt-8 xl:px-0"
      style={style}
    >
      <div className="container mx-auto w-full max-xl:!px-0">
        <h2 className="text-center font-gazpacho text-lg font-medium leading-none tracking-tight text-purple md:text-[1.25rem]">
          Capital at work
        </h2>
        <div className="mt-7 grid w-full grid-cols-2 gap-x-5 gap-y-8 lg:mt-8 lg:grid-cols-4 lg:gap-10">
          {metrics.map((metric, index) => (
            <AnimatedCapitalMetric
              index={index}
              key={metric.title}
              metric={metric}
              progress={progress}
              staticValue={staticValues}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedCapitalMetric({
  index,
  metric,
  progress,
  staticValue = false,
}: {
  index: number;
  metric: CapitalMetric;
  progress: MotionValue<number>;
  staticValue?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const showFinalValue = reducedMotion || staticValue;
  const hasLiveValue = metric.value !== null && Number.isFinite(metric.value);
  const targetValue = metric.value ?? 0;
  const start = 0.3 + index * 0.018;
  const end = start + 0.28;
  const countProgress = useTransform(progress, [start, end], [0, 1], {
    clamp: true,
    ease: metricRevealEase,
  });
  const metricOpacity = useTransform(progress, [start, end], [0.25, 1], {
    ease: metricRevealEase,
  });
  const metricY = useTransform(progress, [start, end], [16, 0], {
    ease: metricRevealEase,
  });
  const valueFilter = useTransform(
    progress,
    [start, end],
    ["blur(10px)", "blur(0px)"],
    { ease: metricRevealEase },
  );
  const [displayValue, setDisplayValue] = useState(() =>
    formatCompactMetric(countProgress.get() * targetValue, metric.prefix),
  );

  useEffect(() => {
    setDisplayValue(
      formatCompactMetric(countProgress.get() * targetValue, metric.prefix),
    );
  }, [countProgress, metric.prefix, targetValue]);

  useMotionValueEvent(countProgress, "change", (latest) => {
    const nextValue = formatCompactMetric(latest * targetValue, metric.prefix);
    setDisplayValue((current) => (current === nextValue ? current : nextValue));
  });

  const finalValue = formatCompactMetric(metric.value, metric.prefix);

  return (
    <motion.article
      className="min-w-0 text-center lg:text-left"
      style={{
        opacity: showFinalValue ? 1 : metricOpacity,
        y: showFinalValue ? 0 : metricY,
      }}
    >
      <motion.p
        className="font-gazpacho text-[clamp(1.75rem,7.5vw,4.125rem)] font-medium leading-[0.95] tracking-[-0.045em] text-purple tabular-nums lg:text-[clamp(3.5rem,4.45vw,4.65rem)] lg:leading-[0.84]"
        style={{ filter: showFinalValue ? "blur(0px)" : valueFilter }}
      >
        {hasLiveValue ? (
          <>
            <span aria-hidden="true">
              {showFinalValue ? finalValue : displayValue}
            </span>
            <span className="sr-only">{finalValue}</span>
          </>
        ) : (
          "—"
        )}
      </motion.p>
      <h3 className="mt-3 max-w-[18rem] text-balance font-gazpacho text-[0.8rem] font-medium leading-[1.08] tracking-tight text-purple/75 md:text-[0.9rem] lg:max-w-none lg:whitespace-nowrap lg:text-[0.82rem] xl:text-[0.9rem]">
        {metric.title}
      </h3>
      {metric.delta !== null && (
        <p className="mt-1 font-geist text-xs font-medium tabular-nums text-purple/65">
          {metric.delta >= 0 ? "+" : "−"}
          {formatCompactMetric(Math.abs(metric.delta), metric.prefix)}
        </p>
      )}
    </motion.article>
  );
}

function AnimatedHeadlineText({
  className,
  delay = 0,
  letterDelay = 0.032,
  text,
  y = 18,
}: {
  className?: string;
  delay?: number;
  letterDelay?: number;
  text: string;
  y?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.span aria-label={text} className={className}>
      {Array.from(text).map((letter, letterIndex) => (
        <motion.span
          aria-hidden="true"
          className="inline-block"
          initial={reducedMotion ? false : { opacity: 0, y }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: delay + letterIndex * letterDelay,
              duration: 0.45,
              ease: headlineEase,
            },
          }}
          key={`${letter}-${letterIndex}`}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
