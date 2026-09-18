"use client";

import { twMerge } from "tailwind-merge";
import { Variants, m } from "framer-motion";
import { fadeUp } from "@/animation/variants";

type ParagraphProps = {
  children: React.ReactNode;
  className?: string;
  size: "small" | "medium" | "large";
  animationVariants?: Variants;
};

export default function Paragraph({
  children,
  className,
  size,
  animationVariants,
}: ParagraphProps) {
  if (size === "large") {
    return (
      <m.p
        className={twMerge(
          "font-geist font-normal ~text-base/lg leading-snug text-purple",
          className
        )}
        variants={animationVariants || fadeUp()}
      >
        {children}
      </m.p>
    );
  }

  if (size === "medium") {
    return (
      <m.p
        className={twMerge(
          "font-geist font-normal text-base leading-tight text-purple",
          className
        )}
        variants={animationVariants || fadeUp()}
      >
        {children}
      </m.p>
    );
  }

  return (
    <m.p
      className={twMerge(
        "font-geist font-normal text-sm leading-tight text-purple",
        className
      )}
      variants={animationVariants || fadeUp()}
    >
      {children}
    </m.p>
  );
}
