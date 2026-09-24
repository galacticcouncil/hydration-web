"use client";

import { homepageCopy } from "@/content/homepage";

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
  m,
  useInView,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/animation/reduced-motion";
import type { MotionStyle, MotionValue } from "framer-motion";
import useScreenSize from "@/hooks/useScreenSize";
import Image from "next/image";
import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";

const HeroWaterCanvas = lazy(() => import("./water-canvas"));

const headlineEase = [0.2, 0.65, 0.3, 0.9] as const;
const metricRevealEase = (value: number) => 1 - Math.pow(1 - value, 3);
// Preserved for another pass: progressively feathers the real scene container
// while it expands, without introducing a duplicate blurred background.
const sceneEdgeFeatherEnabled = false;

export default function HeroSection({
  initialMetrics,
}: {
  initialMetrics?: CapitalMetric[];
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { width: viewportWidth, height: viewportHeight } = useScreenSize();
  const mobileLayout = viewportWidth < 1024;
  const { scrollY, scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });
  // Start at the server-rendered scale. Measuring an already-visible target on
  // hydration would enlarge the hero again and delay its largest-content paint.
  const mobileScale = useTransform(
    scrollY,
    [0, Math.max(viewportHeight, 1)],
    [1, 1.06],
  );

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
  const finalSceneScale = 1.13;
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, finalSceneScale]);
  const heroContentShift = Math.min(
    56,
    14 + Math.max(0, (viewportHeight - 720) * 0.072),
  );
  const heroContentY = useTransform(
    scrollYProgress,
    [0, 0.32, 0.68],
    [14, 14, heroContentShift],
  );
  const heroContentYWithUnit = useMotionTemplate`${heroContentY}px`;
  const introChromeOpacity = useTransform(scrollYProgress, [0.06, 0.23], [1, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.22, 0.36], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.22, 0.4], [42, 0]);

  return (
    <section
      ref={sceneRef}
      data-homepage-hero
      className="relative z-10 bg-beige lg:h-[165vh] lg:min-h-[86rem] lg:motion-reduce:h-auto lg:motion-reduce:min-h-0"
    >
      <div className="relative flex flex-col overflow-hidden lg:sticky lg:top-0 lg:block lg:h-screen">
        <m.div
          data-hero-intro
          className="pointer-events-none relative z-20 flex items-center px-6 pb-12 pt-28 md:px-[50px] lg:absolute lg:inset-x-0 lg:top-0 lg:h-[66vh] lg:min-h-[34rem] lg:pb-0 lg:pt-20 lg:[transform:translateY(var(--hero-content-y))] xl:px-16"
          style={{
            "--hero-content-y": reducedMotion
              ? `${heroContentShift}px`
              : heroContentYWithUnit,
          } as MotionStyle}
        >
          <div className="container relative mx-auto flex min-w-0 justify-center max-xl:!px-0">
            <HeroSectionContent />
          </div>
        </m.div>
        <m.div
          data-hero-background
          className="invisible absolute inset-0 z-[9] overflow-hidden bg-beige lg:visible"
          style={{ opacity: reducedMotion ? 0 : sceneFillOpacity }}
          aria-hidden="true"
        >
          <m.div
            className="absolute inset-0"
            style={{ scale: reducedMotion ? 1 : sceneScale }}
          >
            <Image
              src="/assets/hero-arches-sunset-wide.webp"
              alt=""
              fill
              loading="lazy"
              quality={74}
              sizes="100vw"
              className="object-cover object-[54%_center]"
            />
            <div
              className="pointer-events-none absolute inset-0 z-[7] bg-[url('/noise.svg')] bg-repeat opacity-20 mix-blend-multiply grayscale"
              style={{ backgroundSize: "640px 640px" }}
            />
          </m.div>
        </m.div>

        <div
          data-hero-mobile-scene
          className="relative isolate lg:contents"
        >
          <m.div
            data-hero-scene
            className="absolute inset-x-0 top-0 z-10 h-[22rem] isolate overflow-hidden bg-beige [mask-image:linear-gradient(to_bottom,black_95%,transparent)] sm:h-[26rem] lg:inset-0 lg:h-auto lg:[clip-path:var(--hero-desktop-clip)] lg:[mask-image:none] lg:motion-reduce:[clip-path:none]"
            style={{
              // Keep the desktop motion binding stable across hydration/resizing.
              // The mobile scene stays full width; its bottom mask only fades
              // the composited image edge to prevent a fractional-pixel seam.
              "--hero-desktop-clip": sceneClip,
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
            } as MotionStyle}
          >
            <m.div
              data-hero-scene-scale
              className="absolute inset-0"
              style={{
                scale: mobileLayout
                  ? reducedMotion ? 1 : mobileScale
                  : reducedMotion ? finalSceneScale : sceneScale,
              }}
            >
              <div className="hero-scene-enter absolute inset-0">
                <div
                  className="absolute inset-0 overflow-hidden"
                  aria-hidden="true"
                >
                  <Image
                    src="/assets/hero-arches-sunset-wide.webp"
                    alt=""
                    fill
                    priority
                    fetchPriority="high"
                    quality={74}
                    sizes="100vw"
                    className="object-cover object-center md:[filter:grayscale(6%)] md:[transform:scale(1.124,1.018)]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 hidden bg-beige/20 md:block"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 hidden md:block"
                    style={{
                      background:
                        "radial-gradient(ellipse 70.7% 58% at center, rgba(246, 246, 236, 0.16) 0%, rgba(246, 246, 236, 0.16) 27.5%, rgba(246, 246, 236, 0) 100%)",
                    }}
                  />
                </div>
                {viewportWidth >= 768 && !reducedMotion && (
                  <Suspense fallback={null}>
                    <HeroWaterCanvas
                      className="hero-water-camera"
                      showCapitalBand={false}
                    />
                  </Suspense>
                )}
                <div
                  className="pointer-events-none absolute inset-0 z-[7] bg-[url('/noise.svg')] bg-repeat opacity-20 mix-blend-multiply grayscale"
                  style={{ backgroundSize: "640px 640px" }}
                  aria-hidden="true"
                />
              </div>
            </m.div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -bottom-px top-0 z-[8] bg-[linear-gradient(to_bottom,rgba(246,246,236,0)_18%,rgba(246,246,236,0.86)_60%,#f6f6ec_94%)] lg:hidden"
            />
          </m.div>

          <HeroCapitalStats
            initialMetrics={initialMetrics}
            progress={scrollYProgress}
            staticValues={mobileLayout}
            style={{
              opacity: reducedMotion || mobileLayout ? 1 : statsOpacity,
              y: reducedMotion || mobileLayout ? 0 : statsY,
            }}
          />

          <m.div
            className="relative z-30 mx-auto px-4 pb-8 lg:absolute lg:inset-x-0 lg:bottom-8 lg:z-20 lg:px-[8vw] lg:pb-0 lg:motion-reduce:hidden"
            style={{
              opacity: reducedMotion || mobileLayout ? 1 : introChromeOpacity,
            }}
          >
            <m.div
              className="flex w-full flex-col items-center gap-3 lg:flex-row lg:justify-between lg:gap-0"
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
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
}

function HeroSectionContent() {
  return (
    <div className="pointer-events-auto flex min-w-0 w-full flex-col items-center gap-8 lg:pb-[100px] lg:pt-[150px]">
      <h1 className="w-full max-w-[19ch] min-w-0 text-balance text-center font-gazpacho text-[clamp(2.35rem,11.25vw,2.75rem)] font-medium leading-[0.92] text-purple sm:text-[clamp(2.75rem,7.3vw,5.5rem)] xl:text-[88px]">
        <span className="sr-only">{homepageCopy.hero.title}</span>
        <span className="sm:hidden" aria-hidden="true">
          A&nbsp;secure
          <br />
          home&nbsp;for
          <br />
          <span className="font-normal italic text-[#240E32]">
            your&nbsp;onchain
            <br />
            capital.
          </span>
        </span>
        <span className="hidden sm:inline" aria-hidden="true">
          <AnimatedHeadlineText text="A secure home for" />
          <br />
          <span className="font-normal italic text-[#240E32]">
            <AnimatedHeadlineText delay={0.32} text="your onchain capital." />
          </span>
        </span>
      </h1>
      <div className="hero-copy-enter w-full">
        <Paragraph
          size="large"
          className="mx-auto w-full max-w-[46rem] min-w-0 text-balance text-center text-[20px] leading-[1.25] text-purple lg:text-[24px]"
        >
          {homepageCopy.hero.paragraphs[0]}
        </Paragraph>
      </div>
      <div className="hero-action-enter">
        <HeroLaunchAppButton />
      </div>
    </div>
  );
}

function HeroCapitalStats({
  initialMetrics,
  progress,
  style,
  staticValues = false,
}: {
  initialMetrics?: CapitalMetric[];
  progress: MotionValue<number>;
  style: MotionStyle;
  staticValues?: boolean;
}) {
  const metrics = useCapitalMetrics(initialMetrics);
  const reducedMotion = usePrefersReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.8 });
  const revealHeading = staticValues && !reducedMotion;

  return (
    <m.div
      id="capital"
      className="relative z-30 flex flex-col justify-end bg-transparent px-6 pb-6 pt-28 text-purple sm:pt-32 md:px-[50px] lg:absolute lg:inset-x-0 lg:bottom-0 lg:min-h-[40vh] lg:pb-[7vh] lg:pt-8 xl:px-0"
      style={style}
    >
      <div className="container mx-auto w-full max-xl:!px-0">
        <m.h2
          ref={headingRef}
          className="text-center font-gazpacho text-lg font-medium leading-none tracking-tight text-purple md:text-[1.25rem]"
          initial={revealHeading ? { opacity: 0, y: 12 } : false}
          animate={
            revealHeading
              ? {
                  opacity: headingInView ? 1 : 0,
                  y: headingInView ? 0 : 12,
                }
              : { opacity: 1, y: 0 }
          }
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            ease: headlineEase,
          }}
        >
          Capital at work
        </m.h2>
        <div className="mx-auto mt-6 grid w-full max-w-[36rem] grid-cols-2 gap-x-5 gap-y-6 lg:mt-8 lg:max-w-none lg:grid-cols-4 lg:gap-10">
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
    </m.div>
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
  const reducedMotion = usePrefersReducedMotion();
  const metricRef = useRef<HTMLElement>(null);
  const metricInView = useInView(metricRef, { once: true, amount: 0.4 });
  const revealOnMobile = staticValue && !reducedMotion && !metricInView;
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
    if (showFinalValue) return;
    setDisplayValue(
      formatCompactMetric(countProgress.get() * targetValue, metric.prefix),
    );
  }, [countProgress, metric.prefix, showFinalValue, targetValue]);

  useMotionValueEvent(countProgress, "change", (latest) => {
    if (showFinalValue) return;
    const nextValue = formatCompactMetric(latest * targetValue, metric.prefix);
    setDisplayValue((current) => (current === nextValue ? current : nextValue));
  });

  const finalValue = formatCompactMetric(metric.value, metric.prefix);

  return (
    <m.article
      ref={metricRef}
      className="min-w-0 text-center lg:text-left"
      style={{
        opacity: showFinalValue ? 1 : metricOpacity,
        y: showFinalValue ? 0 : metricY,
      }}
    >
      <m.div
        initial={false}
        animate={{ opacity: revealOnMobile ? 0 : 1, y: revealOnMobile ? 20 : 0 }}
        transition={{
          duration: reducedMotion ? 0 : 0.6,
          delay: reducedMotion ? 0 : index * 0.07,
          ease: headlineEase,
        }}
      >
        <m.p
          className="font-gazpacho text-[clamp(2rem,10vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.045em] text-purple tabular-nums lg:text-[clamp(3.5rem,4.45vw,4.65rem)] lg:leading-[0.84]"
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
        </m.p>
        <h3 className="mx-auto mt-3 max-w-[18rem] text-balance font-geist text-xs font-medium leading-snug text-purple/75 md:text-sm lg:mx-0 lg:max-w-none lg:whitespace-nowrap lg:font-gazpacho lg:text-[0.82rem] lg:leading-[1.08] lg:tracking-tight xl:text-[0.9rem]">
          {metric.title}
        </h3>
        {metric.delta !== null && (
          <p className="mt-1 font-geist text-xs font-medium tabular-nums text-purple/65">
            {metric.delta >= 0 ? "+" : "−"}
            {formatCompactMetric(Math.abs(metric.delta), metric.prefix)}
          </p>
        )}
      </m.div>
    </m.article>
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
  return (
    <span data-animated-heading className={className}>
      {Array.from(text).map((letter, letterIndex) => (
        <span
          aria-hidden="true"
          className="hero-headline-letter inline-block"
          style={{
            "--hero-enter-delay": `${delay + letterIndex * letterDelay}s`,
            "--hero-enter-y": `${y}px`,
          } as CSSProperties}
          key={`${letter}-${letterIndex}`}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}
