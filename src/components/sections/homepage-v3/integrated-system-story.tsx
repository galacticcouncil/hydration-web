"use client";

import Heading from "@/components/ui/typography/heading";
import Paragraph from "@/components/ui/typography/paragraph";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue, Variants } from "framer-motion";
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type LayerName = "base" | "middle" | "top";

type ParticleStage = {
  id: LayerName;
  src: string;
  start: number;
  end: number;
  origin: "top" | "bottom";
  left: number;
  top: number;
  width: number;
  height: number;
  maxPoints: number;
  seed: number;
};

type ParticlePoint = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  radius: number;
  color: string;
  delay: number;
  sway: number;
};

const particleStages: ParticleStage[] = [
  {
    id: "middle",
    src: "/assets/why-hydration-middle-grid.svg",
    start: 0.02,
    end: 0.3,
    origin: "bottom",
    left: 0.10283,
    top: 0.359,
    width: 0.79433,
    height: 0.32526,
    maxPoints: 520,
    seed: 2087,
  },
  {
    id: "top",
    src: "/assets/why-hydration-top-matrix.svg",
    start: 0.36,
    end: 0.64,
    origin: "top",
    left: 0.08071,
    top: 0.06061,
    width: 0.81608,
    height: 0.33677,
    maxPoints: 440,
    seed: 3181,
  },
  {
    id: "base",
    src: "/assets/why-hydration-base-halftone.svg",
    start: 0.7,
    end: 0.96,
    origin: "bottom",
    left: 0.13033,
    top: 0.66056,
    width: 0.68666,
    height: 0.27982,
    maxPoints: 460,
    seed: 1049,
  },
];

export const appchainFeatures = [
  {
    label: "Onchain oracle updates",
    iconColor: "oklch(0.64 0.18 135)",
    icon: "database",
  },
  {
    label: "Transaction prioritization",
    iconColor: "oklch(0.62 0.2 245)",
    icon: "priority",
  },
  {
    label: "Prioritized and partial liquidations",
    iconColor: "oklch(0.68 0.2 350)",
    icon: "partial",
  },
  {
    label: "Protocol-wide risk controls",
    iconColor: "oklch(0.59 0.25 335)",
    icon: "controls",
  },
  {
    label: "Security enforced at the runtime level",
    iconColor: "oklch(0.63 0.17 210)",
    icon: "security",
  },
] as const;

const connectorGroups = [
  {
    color: "#B3CF92",
    lines: [
      {
        x1: 2.973,
        y1: 107.06,
        x2: 2.973,
        y2: 20.319,
        dotX: 2.974,
        dotY: 107.06,
      },
      {
        x1: 201.237,
        y1: 320.194,
        x2: 201.237,
        y2: 196.279,
        dotX: 201.238,
        dotY: 320.194,
      },
    ],
  },
  {
    color: "#53A4E3",
    lines: [
      { x1: 84.76, y1: 81.784, x2: 84.76, y2: 0, dotX: 84.759, dotY: 81.784 },
      {
        x1: 67.412,
        y1: 305.621,
        x2: 67.412,
        y2: 206.489,
        dotX: 67.411,
        dotY: 305.621,
      },
    ],
  },
  {
    color: "#F9AFCA",
    lines: [
      {
        x1: 164.064,
        y1: 35.685,
        x2: 164.064,
        y2: 119.947,
        dotX: 164.063,
        dotY: 35.684,
      },
      {
        x1: 17.843,
        y1: 189.34,
        x2: 17.843,
        y2: 288.472,
        dotX: 17.845,
        dotY: 189.34,
      },
    ],
  },
  {
    color: "#CC1775",
    lines: [
      {
        x1: 42.627,
        y1: 5.945,
        x2: 42.627,
        y2: 119.947,
        dotX: 42.628,
        dotY: 5.945,
      },
      {
        x1: 146.715,
        y1: 189.34,
        x2: 146.715,
        y2: 308.298,
        dotX: 146.716,
        dotY: 189.34,
      },
    ],
  },
  {
    color: "#AAEEFC",
    lines: [
      {
        x1: 206.194,
        y1: 50.555,
        x2: 206.194,
        y2: 134.817,
        dotX: 206.195,
        dotY: 50.554,
      },
      {
        x1: 240.892,
        y1: 146.713,
        x2: 240.892,
        y2: 64.929,
        dotX: 240.89,
        dotY: 146.713,
      },
    ],
  },
] as const;

const storyStepContainer: Variants = {
  initial: {},
  visible: {
    transition: {
      delayChildren: 0.02,
      staggerChildren: 0.065,
    },
  },
};

const storyStepItem: Variants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.46,
      ease: [0.333, 0, 0, 1],
    },
  },
};

const clickThroughSteps = [
  { label: "Overview", progress: 0.3 },
  { label: "Integrated system", progress: 0.61 },
  { label: "Appchain execution", progress: 1 },
] as const;

const clickThroughContentContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0,
      staggerChildren: 0.045,
    },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const clickThroughContentItem: Variants = {
  hidden: {
    opacity: 0,
    x: -18,
    filter: "blur(3px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const CLICK_THROUGH_AUTO_ADVANCE_MS = 5200;

export function IntegratedSystemClickThroughStory() {
  const prefersReducedMotion = useReducedMotion();
  const storyRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(storyRef, { amount: 0.55 });
  const progress = useMotionValue(prefersReducedMotion ? 0.24 : 0);
  const progressAnimation = useRef<ReturnType<typeof animate> | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const selectStep = useCallback(
    (index: number) => {
      const step = clickThroughSteps[index];
      if (!step) return;

      setActiveStep(index);
      progressAnimation.current?.stop();

      if (prefersReducedMotion) {
        progress.set(step.progress);
        return;
      }

      progressAnimation.current = animate(progress, step.progress, {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      });
    },
    [prefersReducedMotion, progress],
  );

  useEffect(() => {
    selectStep(0);
    return () => progressAnimation.current?.stop();
  }, [selectStep]);

  useEffect(() => {
    if (
      !isInView ||
      isPaused ||
      prefersReducedMotion ||
      activeStep === clickThroughSteps.length - 1
    ) {
      return;
    }

    const timeout = window.setTimeout(() => {
      selectStep(activeStep + 1);
    }, CLICK_THROUGH_AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timeout);
  }, [activeStep, isInView, isPaused, prefersReducedMotion, selectStep]);

  return (
    <div
      ref={storyRef}
      className="relative grid items-center gap-10 py-12 lg:grid-cols-[minmax(28rem,1.04fr)_minmax(28rem,0.96fr)] lg:gap-x-12 lg:py-16 xl:grid-cols-[minmax(34rem,1.08fr)_minmax(31rem,0.92fr)]"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <motion.div
        className="mx-auto w-full max-w-[30rem] lg:max-w-none"
        initial={
          prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.98 }
        }
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <HydrationLayerVisual progress={progress} staticState={false} />
      </motion.div>

      <motion.div
        className="p-5 md:p-8 lg:p-10"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="grid grid-cols-[0.8fr_1.1fr_1.3fr] gap-2"
          role="tablist"
          aria-label="Why Hydration topics"
        >
          {clickThroughSteps.map((step, index) => {
            const isActive = activeStep === index;
            const isAutoAdvancing =
              isActive &&
              !isPaused &&
              !prefersReducedMotion &&
              index < clickThroughSteps.length - 1;

            return (
              <button
                key={step.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectStep(index)}
                className={`relative flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-xl px-2.5 py-2 text-left transition-colors duration-300 md:px-3 ${
                  isActive
                    ? isAutoAdvancing
                      ? "bg-purple/70 text-white"
                      : "bg-purple text-white"
                    : "bg-purple/[0.055] text-purple hover:bg-purple/10"
                }`}
              >
                {isAutoAdvancing && (
                  <motion.span
                    key={`progress-${activeStep}`}
                    aria-hidden="true"
                    className="absolute inset-0 origin-left bg-purple"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: CLICK_THROUGH_AUTO_ADVANCE_MS / 1000,
                      ease: "linear",
                    }}
                  />
                )}
                <span className="relative z-10 shrink-0 font-geist text-[0.55rem] font-medium tabular-nums opacity-60 md:text-[0.6rem]">
                  0{index + 1}
                </span>
                <span className="relative z-10 min-w-0 font-geist text-[0.6rem] font-medium leading-none md:text-[0.68rem] xl:text-xs">
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mt-8 flex min-h-[25rem] items-center overflow-hidden md:mt-10 lg:min-h-[27rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              className="w-full"
              key={activeStep}
              variants={clickThroughContentContainer}
              initial={prefersReducedMotion ? false : "hidden"}
              animate={prefersReducedMotion ? undefined : "visible"}
              exit={prefersReducedMotion ? undefined : "exit"}
            >
              {activeStep === 0 ? (
                <WhyHydrationCopy animateItems />
              ) : activeStep === 1 ? (
                <IntegratedSystemCopy animateItems />
              ) : (
                <AppchainExecutionCopy progress={progress} animateItems />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </motion.div>

      <div className="flex items-center justify-center gap-2 rounded-full bg-white/80 p-1.5 backdrop-blur-md lg:absolute lg:bottom-28 lg:left-1/2 lg:z-20 lg:-translate-x-1/2">
        <button
          type="button"
          onClick={() => selectStep(activeStep - 1)}
          disabled={activeStep === 0}
          className="min-w-[6.25rem] rounded-full border border-purple/15 px-5 py-2.5 font-geist text-base font-medium text-purple transition-colors hover:bg-purple hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-purple"
        >
          Previous
        </button>
        <span className="rounded-full bg-purple/10 px-4 py-2.5 font-geist text-base font-semibold tabular-nums text-purple/75">
          0{activeStep + 1} / 03
        </span>
        <button
          type="button"
          onClick={() => selectStep(activeStep + 1)}
          disabled={activeStep === clickThroughSteps.length - 1}
          className="min-w-[6.25rem] rounded-full bg-purple px-5 py-2.5 font-geist text-base font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-default disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function IntegratedSystemStory() {
  const storyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start 88px", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    mass: 0.36,
    restDelta: 0.001,
  });

  return (
    <div
      ref={storyRef}
      className="relative mt-16 lg:mt-0 lg:grid lg:min-h-[270svh] lg:grid-cols-[minmax(28rem,1.04fr)_minmax(28rem,0.96fr)] lg:items-start lg:gap-x-8 xl:grid-cols-[minmax(34rem,1.08fr)_minmax(31rem,0.92fr)] xl:gap-x-12"
    >
      <motion.div
        className="lg:hidden"
        initial={
          prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.97 }
        }
        whileInView={
          prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
        }
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      >
        <HydrationLayerVisual progress={progress} staticState />
      </motion.div>

      <div className="hidden lg:sticky lg:top-[5.5rem] lg:flex lg:h-[calc(100svh-5.5rem)] lg:items-center">
        <div className="w-full -translate-y-[clamp(3rem,6vh,4rem)]">
          <HydrationLayerVisual
            progress={progress}
            staticState={Boolean(prefersReducedMotion)}
          />
        </div>
      </div>

      <div className="relative z-10 mt-16 space-y-24 lg:hidden">
        <StoryStep>
          <Heading
            size="large"
            className="max-w-[14ch] text-balance text-purple lg:text-[3.25rem] lg:leading-[1.206]"
          >
            One integrated
            <br />
            financial system
          </Heading>
          <div className="mt-6 flex max-w-[31rem] flex-col gap-6">
            <Paragraph size="large" className="leading-7 text-purple">
              Hydration’s products are designed to work together rather than
              operate as isolated applications.
            </Paragraph>
            <Paragraph size="large" className="leading-7 text-purple">
              Capital can move efficiently between strategies, borrowing
              markets, liquidity, and HOLLAR without relying on fragmented
              external infrastructure.
            </Paragraph>
          </div>
        </StoryStep>

        <StoryStep>
          <Heading
            size="large"
            className="max-w-[14ch] text-balance text-purple lg:text-[3.25rem] lg:leading-[1.206]"
          >
            Appchain-level
            <br />
            execution
          </Heading>
          <Paragraph
            size="large"
            className="mt-6 max-w-[31rem] leading-7 text-purple"
          >
            Owning the execution environment allows Hydration to optimize how
            financial activity is processed. This includes:
          </Paragraph>
          <ul className="mt-5 space-y-2.5 font-geist text-lg leading-7 text-purple">
            {appchainFeatures.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center"
                >
                  <FilledFeatureIcon name={item.icon} color={item.iconColor} />
                </span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </StoryStep>
      </div>

      <div className="relative z-10 hidden lg:sticky lg:top-[5.5rem] lg:h-[calc(100svh-5.5rem)] lg:items-center lg:overflow-hidden lg:flex">
        <DesktopStoryPanel progress={progress} phase="why">
          <WhyHydrationCopy />
        </DesktopStoryPanel>
        <DesktopStoryPanel progress={progress} phase="integrated">
          <IntegratedSystemCopy />
        </DesktopStoryPanel>
        <DesktopStoryPanel progress={progress} phase="appchain">
          <AppchainExecutionCopy progress={progress} />
        </DesktopStoryPanel>
      </div>
    </div>
  );
}

function WhyHydrationCopy({
  animateItems = false,
}: {
  animateItems?: boolean;
} = {}) {
  const itemVariants = animateItems ? clickThroughContentItem : undefined;

  return (
    <>
      <motion.h2
        className="max-w-[15ch] text-balance font-gazpacho text-[2.65rem] font-medium leading-[1.16] text-purple md:text-[3.35rem] xl:text-[3.75rem]"
        variants={itemVariants}
      >
        Why Hydration
        <br />
        Is Different
      </motion.h2>
      <motion.div
        className="mt-8 flex max-w-[31rem] flex-col gap-5"
        variants={itemVariants}
      >
        <p className="font-geist text-lg font-normal leading-7 text-purple">
          Most DeFi protocols depend on external infrastructure they cannot
          fully control. Hydration owns the full DeFi stack.
        </p>
        <p className="font-geist text-lg font-normal leading-7 text-purple">
          By combining execution, liquidity, lending, stablecoins, oracles, and
          security at the appchain level, Hydration can coordinate products more
          efficiently and protect users at every layer.
        </p>
      </motion.div>
    </>
  );
}

function IntegratedSystemCopy({
  animateItems = false,
}: {
  animateItems?: boolean;
} = {}) {
  const itemVariants = animateItems ? clickThroughContentItem : undefined;

  return (
    <>
      <motion.h2
        className="max-w-[14ch] text-balance font-gazpacho text-[2.65rem] font-medium leading-[1.206] text-purple md:text-[3.25rem]"
        variants={itemVariants}
      >
        One integrated
        <br />
        financial system
      </motion.h2>
      <motion.div
        className="mt-6 flex max-w-[31rem] flex-col gap-6"
        variants={itemVariants}
      >
        <p className="font-geist text-lg font-normal leading-7 text-purple">
          Hydration’s products are designed to work together rather than operate
          as isolated applications.
        </p>
        <p className="font-geist text-lg font-normal leading-7 text-purple">
          Capital can move efficiently between strategies, borrowing markets,
          liquidity, and HOLLAR without relying on fragmented external
          infrastructure.
        </p>
      </motion.div>
    </>
  );
}

function AppchainExecutionCopy({
  progress,
  animateItems = false,
}: {
  progress: MotionValue<number>;
  animateItems?: boolean;
}) {
  const itemVariants = animateItems ? clickThroughContentItem : undefined;

  return (
    <>
      <motion.h2
        className="max-w-[14ch] text-balance font-gazpacho text-[2.65rem] font-medium leading-[1.206] text-purple md:text-[3.25rem]"
        variants={itemVariants}
      >
        Appchain-level
        <br />
        execution
      </motion.h2>
      <motion.p
        className="mt-6 max-w-[31rem] font-geist text-lg font-normal leading-7 text-purple"
        variants={itemVariants}
      >
        Owning the execution environment allows Hydration to optimize how
        financial activity is processed. This includes:
      </motion.p>
      <motion.ul
        className="mt-5 space-y-2.5 font-geist text-lg leading-7 text-purple"
        variants={itemVariants}
      >
        {appchainFeatures.map((item, index) => (
          <AppchainFeature
            key={item.label}
            item={item}
            index={index}
            progress={progress}
          />
        ))}
      </motion.ul>
    </>
  );
}

function FilledFeatureIcon({
  name,
  color,
}: {
  name: (typeof appchainFeatures)[number]["icon"];
  color: string;
}) {
  const sharedProps = {
    className: "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  } as const;

  if (name === "database") {
    return (
      <svg {...sharedProps} style={{ color }}>
        <ellipse cx="9.5" cy="5.25" rx="6.5" ry="3.25" fill="currentColor" />
        <path
          d="M3 6.3v4c0 1.8 2.91 3.25 6.5 3.25 1.3 0 2.52-.2 3.53-.54a6.8 6.8 0 0 1 2.97-2.2V6.3c-1.15 1.3-3.61 2.2-6.5 2.2S4.15 7.6 3 6.3Z"
          fill="currentColor"
        />
        <path
          d="M3 11.15v4.1c0 1.8 2.91 3.25 6.5 3.25.58 0 1.14-.04 1.67-.11a6.8 6.8 0 0 1 .48-4.41c-.69.12-1.41.18-2.15.18-2.89 0-5.35-.89-6.5-2.21Z"
          fill="currentColor"
        />
        <path
          d="M17.5 12a5.5 5.5 0 0 0-5.13 3.5l1.9.67a3.5 3.5 0 0 1 5.72-1.3l-1.5.05 2.07 2.02 1.93-2.15-1.42.05A5.48 5.48 0 0 0 17.5 12Zm3.23 6.83a3.5 3.5 0 0 1-5.72 1.3l1.5-.05-2.07-2.02-1.93 2.15 1.42-.05a5.5 5.5 0 0 0 8.7-2l-1.9-.67Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "priority") {
    return (
      <svg {...sharedProps} style={{ color }}>
        <path d="M6 2.5 10.5 8H7.7v6.5H4.3V8H1.5L6 2.5Z" fill="currentColor" />
        <path d="m6 21.5-4.5-5.5h2.8V9.5h3.4V16h2.8L6 21.5Z" fill="currentColor" />
        <rect x="12" y="4" width="10" height="3" rx="1.5" fill="currentColor" />
        <rect x="12" y="10.5" width="7.5" height="3" rx="1.5" fill="currentColor" />
        <rect x="12" y="17" width="5" height="3" rx="1.5" fill="currentColor" />
      </svg>
    );
  }

  if (name === "partial") {
    return (
      <svg {...sharedProps} style={{ color }}>
        <path
          d="M10.5 2.25A9.75 9.75 0 1 0 21.75 13.5H10.5V2.25Z"
          fill="currentColor"
        />
        <path
          d="M13.5 2.25v8.25h8.25a9.76 9.76 0 0 0-8.25-8.25Z"
          fill="white"
        />
      </svg>
    );
  }

  if (name === "controls") {
    return (
      <svg {...sharedProps} style={{ color }}>
        <rect x="2" y="4" width="20" height="3" rx="1.5" fill="currentColor" />
        <circle cx="8" cy="5.5" r="3.5" fill="currentColor" />
        <rect x="2" y="10.5" width="20" height="3" rx="1.5" fill="currentColor" />
        <circle cx="16.5" cy="12" r="3.5" fill="currentColor" />
        <rect x="2" y="17" width="20" height="3" rx="1.5" fill="currentColor" />
        <circle cx="11" cy="18.5" r="3.5" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg {...sharedProps} style={{ color }}>
      <path
        d="M12 1.75 21 5v6.1c0 5.46-3.69 9.07-9 11.15-5.31-2.08-9-5.69-9-11.15V5l9-3.25Z"
        fill="currentColor"
      />
      <path
        d="m8.1 11.8 2.55 2.55 5.4-5.4"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function AppchainFeature({
  item,
  index,
  progress,
}: {
  item: (typeof appchainFeatures)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.74 + index * 0.045;
  const opacity = useTransform(progress, [start, start + 0.035], [0, 1], {
    clamp: true,
  });
  const y = useTransform(progress, [start, start + 0.035], [10, 0], {
    clamp: true,
  });
  const iconScale = useTransform(
    progress,
    [start + 0.03, start + 0.055],
    [0, 1],
    { clamp: true },
  );

  return (
    <motion.li
      className="flex items-center gap-3"
      initial={false}
      style={{ opacity, y }}
    >
      <motion.span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center"
        style={{
          scale: iconScale,
        }}
      >
        <FilledFeatureIcon name={item.icon} color={item.iconColor} />
      </motion.span>
      <span>{item.label}</span>
    </motion.li>
  );
}

function DesktopStoryPanel({
  children,
  progress,
  phase,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  phase: "why" | "integrated" | "appchain";
}) {
  const whyOpacity = useTransform(
    progress,
    [0, 0.3, 0.36],
    [1, 1, 0],
  );
  const whyY = useTransform(progress, [0, 0.3, 0.36], [0, 0, -16]);
  const integratedOpacity = useTransform(
    progress,
    [0.3, 0.36, 0.64, 0.7],
    [0, 1, 1, 0],
  );
  const integratedY = useTransform(
    progress,
    [0.3, 0.36, 0.64, 0.7],
    [24, 0, 0, -18],
  );
  const appchainOpacity = useTransform(progress, [0.64, 0.7, 1], [0, 1, 1]);
  const appchainY = useTransform(progress, [0.64, 0.7, 1], [22, 0, 0]);

  const opacity =
    phase === "why"
      ? whyOpacity
      : phase === "integrated"
        ? integratedOpacity
        : appchainOpacity;
  const y =
    phase === "why" ? whyY : phase === "integrated" ? integratedY : appchainY;

  return (
    <motion.article
      className="absolute inset-0 flex items-center"
      style={{
        opacity,
        y,
        pointerEvents: phase === "appchain" ? undefined : "none",
      }}
    >
      <div className="-translate-y-[clamp(3rem,6vh,4rem)]">{children}</div>
    </motion.article>
  );
}

function StoryStep({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.article
      className={className}
      initial="initial"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px 2% 0px" }}
    >
      <motion.div variants={storyStepContainer}>
        {Children.map(children, (child, index) => (
          <motion.div key={index} variants={storyStepItem}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    </motion.article>
  );
}

export function IntegratedSystemStaticVisual() {
  const progress = useMotionValue(1);

  return <HydrationLayerVisual progress={progress} staticState />;
}

function HydrationLayerVisual({
  progress,
  staticState,
}: {
  progress: MotionValue<number>;
  staticState: boolean;
}) {
  // The vector art resolves only at the end of each sampled-particle pass.
  // That keeps the incoming state particulate without leaving thousands of
  // moving SVG paths in the DOM.
  const baseOpacity = useTransform(progress, [0.88, 0.96], [0, 1]);

  const wireOpacity = useTransform(progress, [0.2, 0.3], [0, 0.8]);
  const middleOpacity = useTransform(progress, [0.23, 0.3], [0, 1]);
  const middleY = useTransform(progress, [0.23, 0.3], [5, 0]);
  const middleScale = useTransform(progress, [0.23, 0.3], [0.985, 1]);

  const centerNodeOpacity = useTransform(progress, [0.19, 0.26], [0, 1]);
  const centerNodeScale = useTransform(progress, [0.19, 0.26], [0.72, 1]);
  const logoOpacity = useTransform(progress, [0.23, 0.3], [0, 1]);
  const logoScale = useTransform(progress, [0.23, 0.3], [0.7, 1]);

  // The endpoint system resolves last, with the appchain copy and its matching
  // brand-color bullets.
  const topOpacity = useTransform(progress, [0.56, 0.64], [0, 1]);
  const topY = useTransform(progress, [0.56, 0.64], [-7, 0]);
  const topScale = useTransform(progress, [0.56, 0.64], [0.985, 1]);
  const visualY = useTransform(progress, [0, 1], [14, -12]);

  return (
    <motion.figure
      className="relative mx-auto aspect-[497/638] w-full max-w-[31rem] overflow-visible lg:max-w-[36rem] xl:max-w-[42rem]"
      style={{ y: staticState ? 0 : visualY }}
      aria-label={
        staticState
          ? "Hydration's integrated appchain layers"
          : "Hydration's integrated appchain layers assembling from particles"
      }
    >
      <motion.img
        aria-hidden="true"
        alt=""
        src="/assets/why-hydration-wireframe.svg"
        className="absolute object-contain"
        style={{
          left: "8.109%",
          top: "35.176%",
          width: "83.782%",
          height: "33.972%",
          opacity: staticState ? 0.8 : wireOpacity,
        }}
      />

      <motion.img
        aria-hidden="true"
        alt=""
        src="/assets/why-hydration-top-matrix.svg"
        className="absolute object-contain"
        style={{
          left: "8.071%",
          top: "6.061%",
          width: "81.608%",
          height: "33.677%",
          opacity: staticState ? 1 : topOpacity,
          y: staticState ? 0 : topY,
          scale: staticState ? 1 : topScale,
          transformOrigin: "50% 0%",
        }}
      />

      <motion.img
        aria-hidden="true"
        alt=""
        src="/assets/why-hydration-middle-grid.svg"
        className="absolute object-contain"
        style={{
          left: "10.283%",
          top: "35.9%",
          width: "79.433%",
          height: "32.526%",
          opacity: staticState ? 1 : middleOpacity,
          y: staticState ? 0 : middleY,
          scale: staticState ? 1 : middleScale,
          transformOrigin: "50% 50%",
        }}
      />

      <motion.img
        aria-hidden="true"
        alt=""
        src="/assets/why-hydration-base-halftone.svg"
        className="absolute object-contain"
        style={{
          left: "13.033%",
          top: "66.056%",
          width: "68.666%",
          height: "27.982%",
          opacity: staticState ? 1 : baseOpacity,
        }}
      />

      <StaggeredConnectors progress={progress} staticState={staticState} />

      <motion.img
        aria-hidden="true"
        alt=""
        src="/assets/why-hydration-center-node.svg"
        className="absolute object-contain"
        style={{
          left: "43.943%",
          top: "52.214%",
          width: "11.957%",
          height: "3.963%",
          opacity: staticState ? 1 : centerNodeOpacity,
          scale: staticState ? 1 : centerNodeScale,
        }}
      />

      <motion.img
        aria-hidden="true"
        alt=""
        src="/assets/why-hydration-logo.svg"
        className="absolute object-contain"
        style={{
          left: "43.943%",
          top: "45.688%",
          width: "11.729%",
          height: "9.476%",
          opacity: staticState ? 1 : logoOpacity,
          scale: staticState ? 1 : logoScale,
        }}
      />

      {!staticState && <ParticleAssemblyCanvas progress={progress} />}
    </motion.figure>
  );
}

function StaggeredConnectors({
  progress,
  staticState,
}: {
  progress: MotionValue<number>;
  staticState: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 243.864 323.168"
      preserveAspectRatio="none"
      className="pointer-events-none absolute overflow-visible"
      style={{
        left: "25.463%",
        top: "29.138%",
        width: "49.072%",
        height: "50.709%",
      }}
    >
      {connectorGroups.map((group, index) => (
        <ConnectorGroup
          key={group.color}
          group={group}
          index={index}
          progress={progress}
          staticState={staticState}
        />
      ))}
    </svg>
  );
}

function ConnectorGroup({
  group,
  index,
  progress,
  staticState,
}: {
  group: (typeof connectorGroups)[number];
  index: number;
  progress: MotionValue<number>;
  staticState: boolean;
}) {
  const start = 0.74 + index * 0.045;
  const pathLength = useTransform(progress, [start, start + 0.045], [0, 1], {
    clamp: true,
  });
  const opacity = useTransform(progress, [start, start + 0.025], [0, 1], {
    clamp: true,
  });
  const dotOpacity = useTransform(
    progress,
    [start + 0.04, start + 0.055],
    [0, 1],
    { clamp: true },
  );
  const dotRadius = useTransform(
    progress,
    [start + 0.04, start + 0.058, start + 0.075],
    [0, 3.45, 2.974],
    { clamp: true },
  );

  return (
    <g>
      {group.lines.map((line, lineIndex) => (
        <g key={`${line.x1}-${line.y1}-${lineIndex}`}>
          <motion.line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={group.color}
            strokeWidth="0.644359"
            strokeDasharray="1.49 1.98"
            style={{
              opacity: staticState ? 1 : opacity,
              pathLength: staticState ? 1 : pathLength,
            }}
          />
          <motion.circle
            cx={line.dotX}
            cy={line.dotY}
            r={staticState ? 2.974 : dotRadius}
            fill={group.color}
            style={{
              opacity: staticState ? 1 : dotOpacity,
            }}
          />
        </g>
      ))}
    </g>
  );
}

function ParticleAssemblyCanvas({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Record<LayerName, ParticlePoint[]>>({
    base: [],
    middle: [],
    top: [],
  });
  const progressRef = useRef(progress.get());
  const frameRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  const draw = useCallback(() => {
    frameRef.current = null;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { width, height, dpr } = sizeRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!width || !height) return;

    const sectionProgress = progressRef.current;

    particleStages.forEach((stage) => {
      if (sectionProgress < stage.start || sectionProgress > stage.end) return;

      const stageProgress = clamp(
        (sectionProgress - stage.start) / (stage.end - stage.start),
      );
      const arrivalFade = smoothstep(0.015, 0.22, stageProgress);
      const resolveFade = 1 - smoothstep(0.72, 1, stageProgress);
      const points = pointsRef.current[stage.id];
      const scalesInPlace = stage.id === "base";

      points.forEach((point) => {
        const pointProgress = clamp(
          (stageProgress - point.delay) / (1 - point.delay),
        );
        const eased = easeOutQuint(pointProgress);
        const sizeScale = mix(
          scalesInPlace ? 0 : 0.16,
          1,
          easeOutQuint(clamp(pointProgress * (scalesInPlace ? 1.18 : 1.45))),
        );
        const x = scalesInPlace ? point.x : mix(point.startX, point.x, eased);
        const y = scalesInPlace
          ? point.y
          : mix(point.startY, point.y, eased) +
            Math.sin(pointProgress * Math.PI) * point.sway;
        const pointFade = smoothstep(0, 0.24, pointProgress);
        const alpha = arrivalFade * resolveFade * pointFade;
        if (alpha <= 0.01) return;

        context.beginPath();
        context.fillStyle = point.color;
        context.globalAlpha = alpha;
        context.arc(
          x * dpr,
          y * dpr,
          point.radius * sizeScale * dpr,
          0,
          Math.PI * 2,
        );
        context.fill();
      });
    });

    context.globalAlpha = 1;
  }, []);

  const scheduleDraw = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useMotionValueEvent(progress, "change", (latest) => {
    progressRef.current = latest;
    scheduleDraw();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let buildVersion = 0;

    const rebuild = async () => {
      const version = ++buildVersion;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(bounds.width * dpr);
      canvas.height = Math.round(bounds.height * dpr);
      sizeRef.current = { width: bounds.width, height: bounds.height, dpr };

      const images = await Promise.all(
        particleStages.map((stage) => loadParticleImage(stage.src)),
      );
      if (cancelled || version !== buildVersion) return;

      const nextPoints = {
        base: [] as ParticlePoint[],
        middle: [] as ParticlePoint[],
        top: [] as ParticlePoint[],
      };

      particleStages.forEach((stage, index) => {
        nextPoints[stage.id] = sampleParticleLayer(
          images[index],
          stage,
          bounds.width,
          bounds.height,
          dpr,
        );
      });

      pointsRef.current = nextPoints;
      scheduleDraw();
    };

    const observer = new ResizeObserver(() => {
      void rebuild();
    });
    observer.observe(canvas);
    void rebuild();

    return () => {
      cancelled = true;
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [scheduleDraw]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

function sampleParticleLayer(
  image: HTMLImageElement,
  stage: ParticleStage,
  width: number,
  height: number,
  dpr: number,
) {
  const samplingCanvas = document.createElement("canvas");
  samplingCanvas.width = Math.round(width * dpr);
  samplingCanvas.height = Math.round(height * dpr);
  const context = samplingCanvas.getContext("2d", { willReadFrequently: true });
  if (!context) return [];

  context.drawImage(
    image,
    stage.left * samplingCanvas.width,
    stage.top * samplingCanvas.height,
    stage.width * samplingCanvas.width,
    stage.height * samplingCanvas.height,
  );

  const pixels = context.getImageData(
    0,
    0,
    samplingCanvas.width,
    samplingCanvas.height,
  );
  const candidates: Array<{
    x: number;
    y: number;
    color: string;
  }> = [];
  const step = Math.max(2, Math.round(dpr * 2));

  for (let y = 0; y < samplingCanvas.height; y += step) {
    for (let x = 0; x < samplingCanvas.width; x += step) {
      const offset = (y * samplingCanvas.width + x) * 4;
      const alpha = pixels.data[offset + 3];
      if (alpha < 72) continue;

      candidates.push({
        x: x / dpr,
        y: y / dpr,
        color: `rgb(${pixels.data[offset]} ${pixels.data[offset + 1]} ${pixels.data[offset + 2]})`,
      });
    }
  }

  const random = seededRandom(stage.seed);
  const selected = reservoirSample(candidates, stage.maxPoints, random);

  return selected.map((candidate) => {
    const normalizedY = candidate.y / height;
    const verticalOrder =
      stage.origin === "top" ? normalizedY : 1 - normalizedY;
    const isBaseLayer = stage.id === "base";
    const startY =
      stage.origin === "top"
        ? -18 - random() * 112
        : height + 18 + random() * (isBaseLayer ? 58 : 112);
    return {
      x: candidate.x,
      y: candidate.y,
      // Base dots stay in their final coordinates and resolve through scale.
      // The other layers retain the more spatial assembly motion.
      startX: isBaseLayer ? candidate.x : candidate.x + (random() - 0.5) * 150,
      startY: isBaseLayer ? candidate.y : startY,
      radius: 0.8 + random() * 1.35,
      color: candidate.color,
      delay: isBaseLayer
        ? verticalOrder * 0.24 + random() * 0.075
        : verticalOrder * 0.13 + random() * 0.045,
      sway: isBaseLayer ? 0 : (random() - 0.5) * 18,
    };
  });
}

function loadParticleImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error(`Could not load particle layer: ${src}`));
    image.src = src;
  });
}

function reservoirSample<T>(
  candidates: T[],
  maxPoints: number,
  random: () => number,
) {
  if (candidates.length <= maxPoints) return candidates;

  const sample = candidates.slice(0, maxPoints);
  for (let index = maxPoints; index < candidates.length; index += 1) {
    const replacement = Math.floor(random() * (index + 1));
    if (replacement < maxPoints) sample[replacement] = candidates[index];
  }
  return sample;
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function easeOutQuint(value: number) {
  return 1 - Math.pow(1 - value, 5);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const progress = clamp((value - edge0) / (edge1 - edge0));
  return progress * progress * (3 - 2 * progress);
}
