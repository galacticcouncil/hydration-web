import type { ComponentProps, ReactNode } from "react";
import { Variants, motion, useReducedMotion } from "framer-motion";

type MotionViewport = NonNullable<
  ComponentProps<typeof motion.section>["viewport"]
>;

export type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  element?: "section" | "div" | "article";
  alwaysVisible?: boolean;
  variants?: Variants;
  style?: React.CSSProperties;
  threshold?: number;
  viewportMargin?: MotionViewport["margin"];
};

export default function AnimateOnView({
  children,
  className,
  element = "section",
  alwaysVisible = false,
  variants,
  style,
  threshold = 0.5,
  viewportMargin = "0px",
}: MotionSectionProps) {
  const reducedMotion = useReducedMotion();
  const showImmediately = alwaysVisible || reducedMotion;
  const props = {
    "data-reveal": "",
    className,
    initial: showImmediately ? "visible" : "initial",
    animate: showImmediately ? "visible" : undefined,
    whileInView: showImmediately ? undefined : "visible",
    viewport: { once: true, amount: threshold, margin: viewportMargin },
    variants,
    style,
  };
  if (element === "div") {
    return <motion.div {...props}>{children}</motion.div>;
  }
  return <motion.section {...props}>{children}</motion.section>;
}
