"use client";

import { fadeUp } from "@/animation/variants";
import { motion } from "framer-motion";
import Caption from "../typography/caption";
import { twMerge } from "tailwind-merge";

type Props = {
  children: string;
  captionClassName?: string;
  iconClassName?: string;
};

export default function SectionLabel({
  children,
  captionClassName,
}: Props) {
  return (
    <motion.div
      className="flex items-center"
      variants={fadeUp(10)}
    >
      <Caption
        className={twMerge("text-lavender ~text-sm/base", captionClassName)}
      >
        {children}
      </Caption>
    </motion.div>
  );
}
