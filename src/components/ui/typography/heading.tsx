"use client";

import { twMerge } from "tailwind-merge";
import LetterByLetter from "@/components/animation/LetterByLetter";
import { ReactNode } from "react";
import { Variants } from "framer-motion";
import { motion } from "framer-motion";

type HeadingProps = {
  children: ReactNode;
  className?: string;
  animationVariants?: Variants;
  size: "small" | "medium" | "large";
};

export default function Heading({
  children,
  className,
  size,
  animationVariants,
}: HeadingProps) {
  if (size === "small") {
    return (
      <h4
        className={twMerge(
          "font-gazpacho font-medium ~text-2xl/3xl leading-tight text-purple",
          className
        )}
      >
        {animationVariants ? (
          <motion.span className="block" variants={animationVariants}>{children}</motion.span>
        ) : (
          <LetterByLetter staggerDelay={0.02}>{children}</LetterByLetter>
        )}
      </h4>
    );
  }

  if (size === "large") {
    return (
      <h2
        className={twMerge(
          "font-gazpacho font-medium ~text-3xl/5xl leading-tight text-purple",
          className
        )}
      >
        {animationVariants ? (
          <motion.span className="block" variants={animationVariants}>{children}</motion.span>
        ) : (
          <LetterByLetter staggerDelay={0.03}>{children}</LetterByLetter>
        )}
      </h2>
    );
  }

  return (
    <h3
      className={twMerge(
        "font-gazpacho font-bold ~text-3xl/4xl leading-tight text-purple",
        className
      )}
    >
      {animationVariants ? (
        <motion.span className="block" variants={animationVariants}>{children}</motion.span>
      ) : (
        <LetterByLetter staggerDelay={0.03}>{children}</LetterByLetter>
      )}
    </h3>
  );
}
