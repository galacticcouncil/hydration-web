"use client";

import Image, { type ImageProps } from "next/image";
import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type AnimatedIllustrationProps = Omit<ImageProps, "src"> & {
  src: string;
  animatedSrc: string;
};

export default function AnimatedIllustration({
  src,
  animatedSrc,
  alt,
  ...imageProps
}: AnimatedIllustrationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const reducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="relative h-full w-full">
      <Image
        {...imageProps}
        alt={alt}
        // Static exports avoid running SVG animations outside the viewport.
        src={inView && reducedMotion === false ? animatedSrc : src}
      />
    </div>
  );
}
