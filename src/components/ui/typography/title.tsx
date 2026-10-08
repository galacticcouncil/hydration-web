"use client";

import LetterByLetter from "@/components/animation/LetterByLetter";
import { twMerge } from "tailwind-merge";
import { m } from "framer-motion";
import { fadeIn } from "@/animation/variants";

type TitleProps = {
  children: React.ReactNode;
  className?: string;
  size?: "large" | "small";
};

export default function Title({ children, className, size }: TitleProps) {
  if (size === "large") {
    return (
      <h5
        className={twMerge(
          "font-geist font-medium text-2xl tracking-tight leading-tight text-purple",
          className
        )}
      >
        <m.div variants={fadeIn()}>{children}</m.div>
      </h5>
    );
  }

  return (
    <h6
      className={twMerge(
        "font-gazpacho font-medium text-xl tracking-tight leading-tight text-purple",
        className
      )}
    >
      <m.div variants={fadeIn()}>{children}</m.div>
    </h6>
  );
}
