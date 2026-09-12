"use client";

import { fadeUp, revealStagger } from "@/animation/variants";
import Paragraph from "@/components/ui/typography/paragraph";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

const accentClasses = {
  lavender:
    "bg-lavender/40 text-purple shadow-[0_0_0_18px_rgba(223,177,243,0.28)]",
  blue:
    "bg-blue/45 text-purple shadow-[0_0_0_18px_rgba(179,215,250,0.3)]",
  green:
    "bg-green/55 text-purple shadow-[0_0_0_18px_rgba(179,207,146,0.3)]",
} as const;

const gradientAccentClasses = {
  lavender: {
    fill: "from-lavender/10 via-lavender/30 to-lavender/55",
    halo: "from-lavender/5 via-lavender/15 to-lavender/30",
  },
  blue: {
    fill: "from-blue/10 via-blue/30 to-blue/55",
    halo: "from-blue/5 via-blue/15 to-blue/30",
  },
  green: {
    fill: "from-green/10 via-green/30 to-green/55",
    halo: "from-green/5 via-green/15 to-green/30",
  },
} as const;

const cardMaskStyle = {
  WebkitMaskImage:
    "radial-gradient(circle 2rem at 0 100%, transparent 0 1.98rem, #000 2rem), radial-gradient(circle 2rem at 100% 100%, transparent 0 1.98rem, #000 2rem)",
  WebkitMaskPosition: "left top, right top",
  WebkitMaskRepeat: "no-repeat, no-repeat",
  WebkitMaskSize: "50.1% 100%, 50.1% 100%",
  maskImage:
    "radial-gradient(circle 2rem at 0 100%, transparent 0 1.98rem, #000 2rem), radial-gradient(circle 2rem at 100% 100%, transparent 0 1.98rem, #000 2rem)",
  maskPosition: "left top, right top",
  maskRepeat: "no-repeat, no-repeat",
  maskSize: "50.1% 100%, 50.1% 100%",
} satisfies CSSProperties;

export type ArchFeatureAccent = keyof typeof accentClasses;

export default function ArchFeatureCard({
  title,
  description,
  accent,
  icon,
  accentFill = "solid",
}: {
  title: string;
  description: string;
  accent: ArchFeatureAccent;
  icon: ReactNode;
  accentFill?: "solid" | "gradient";
}) {
  return (
    <motion.article
      className="relative mx-auto flex min-h-[25rem] w-[80vw] max-w-[24rem] flex-col items-center overflow-hidden rounded-t-full bg-white px-7 pb-11 pt-[3.25rem] text-center shadow-[0_18px_60px_rgba(36,14,50,0.08)] lg:min-h-[37rem] lg:w-full lg:max-w-[30rem] lg:px-12 lg:pb-14 lg:pt-20"
      style={cardMaskStyle}
      variants={revealStagger(0.08, 28)}
    >
      <motion.div
        className="relative z-10 mt-1 grid w-full justify-items-center lg:mt-0"
        variants={fadeUp(16)}
      >
        <div
          className={`relative grid h-24 w-24 place-items-center rounded-full lg:h-32 lg:w-32 ${accentFill === "gradient" ? "text-purple" : accentClasses[accent]}`}
        >
          {accentFill === "gradient" && (
            <>
              <span aria-hidden="true" className={`pointer-events-none absolute -inset-[18px] rounded-full bg-gradient-to-br ${gradientAccentClasses[accent].halo}`} />
              <span aria-hidden="true" className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br ${gradientAccentClasses[accent].fill}`} />
            </>
          )}
          <span className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center [&>svg]:block">
            {icon}
          </span>
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 mt-12 flex max-w-[22rem] flex-col items-center lg:mt-20 lg:max-w-[24rem]"
        variants={fadeUp(22)}
      >
        <h3 className="font-gazpacho text-[clamp(1.3rem,2.2125vw,2.4rem)] font-medium leading-none text-purple">
          {title}
        </h3>
        <Paragraph
          size="large"
          className="mt-5 max-w-[19.5rem] text-purple-dim lg:mt-8 lg:max-w-[21rem]"
        >
          {description}
        </Paragraph>
      </motion.div>
    </motion.article>
  );
}
