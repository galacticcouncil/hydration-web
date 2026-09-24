import type { ComponentProps, ReactNode } from "react";
import { Variants, m } from "framer-motion";
import { usePrefersReducedMotion } from "@/animation/reduced-motion";

type MotionViewport = NonNullable<
  ComponentProps<typeof m.section>["viewport"]
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
  const reducedMotion = usePrefersReducedMotion();
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
    return <m.div {...props}>{children}</m.div>;
  }
  return <m.section {...props}>{children}</m.section>;
}
