"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

const launchAppStyles =
  "flex h-12 items-center justify-center whitespace-nowrap rounded-xl bg-pink px-5 font-geist text-base font-normal leading-6 text-white transition-colors hover:bg-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink";

export function HeroLaunchAppButton() {
  return (
    <a
      data-hero-launch-anchor
      href="https://app.hydration.net"
      target="_blank"
      rel="noopener noreferrer"
      className={`${launchAppStyles} w-[257px]`}
    >
      Launch the app
    </a>
  );
}

export default function LaunchAppButton() {
  const slotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    const header = slot?.closest("header");
    if (!header) return;

    const heroAnchor = document.querySelector<HTMLElement>(
      "[data-hero-launch-anchor]",
    );
    let frameId = 0;

    const updateVisibility = () => {
      setVisible(
        !heroAnchor ||
          heroAnchor.getBoundingClientRect().bottom <=
            header.getBoundingClientRect().bottom,
      );
    };
    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(header);
    if (heroAnchor) resizeObserver.observe(heroAnchor);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div ref={slotRef} className="shrink-0">
      <motion.a
        href="https://app.hydration.net"
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        className={`${launchAppStyles} !px-3 !text-sm sm:!px-5 sm:!text-base`}
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible || reducedMotion ? 0 : -6 }}
        transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeOut" }}
        style={{ pointerEvents: visible ? "auto" : "none" }}
      >
        Launch the app
      </motion.a>
    </div>
  );
}
