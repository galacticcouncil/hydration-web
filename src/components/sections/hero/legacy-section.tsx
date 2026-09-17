"use client";

import Paragraph from "@/components/ui/typography/paragraph";
import Button from "@/components/ui/buttons/button";
import Socials from "@/components/footer/socials";
import SupportingBadge from "@/components/badges/supportingBadge";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { delayChildren } from "@/animation/variants";
import AnimateOnView from "@/animation/motion-section";
import useScreenSize from "@/hooks/useScreenSize";

const headlineEase = [0.2, 0.65, 0.3, 0.9] as const;
const firstAnimatedWordDelayMs = 830;
const wordRotationDelayMs = 1650;

export default function LegacyHeroSection() {
  return (
    <AnimateOnView className="relative overflow-hidden lg:min-h-[820px]">
      <div
        className="absolute inset-0 z-[7] pointer-events-none bg-[url('/noise.svg')] bg-repeat opacity-50 mix-blend-multiply grayscale"
        style={{ backgroundSize: "640px 640px" }}
        aria-hidden="true"
      />
      <video
        className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center brightness-105 blur-[3.5px]"
        src="/hero-bg.mp4"
        poster="/hero-hq.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[72%] bg-gradient-to-t from-beige/90 via-beige/42 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_0%,black_35%,rgba(0,0,0,0.72)_64%,transparent_100%)]"
        aria-hidden="true"
      />
      <div className="relative z-20 lg:min-h-[820px]">
        <div className="container relative mx-auto flex justify-between px-6 md:px-[50px] xl:px-16 lg:min-h-[820px]">
          <HeroSectionContent />
          <motion.div
            className="absolute inset-x-0 bottom-4 mx-auto flex flex-col items-center gap-[3.25rem] px-6 md:px-[50px] lg:bottom-[2.375rem] lg:flex-row lg:justify-between lg:gap-0 xl:px-16"
            variants={delayChildren(0.75)}
          >
            <Socials />
            <SupportingBadge />
          </motion.div>
        </div>
      </div>
    </AnimateOnView>
  );
}
function HeroSectionContent() {
  const [index, setIndex] = useState(0);
  const [showAnimatedWord, setShowAnimatedWord] = useState(false);
  const [canRotateWords, setCanRotateWords] = useState(false);
  const { width: screenWidth } = useScreenSize();

  const texts = useMemo(() => {
    if (screenWidth < 1024) {
      return [
        { value: "efficient", waitAfter: 4000 },
        { value: "simple", waitAfter: 4000 },
      ];
    }

    return [
      { value: "efficient", waitAfter: 3000 },
      { value: "simple", waitAfter: 3000 },
      { value: "unstoppable.", waitAfter: 5000 },
    ];
  }, [screenWidth]);

  useEffect(() => {
    const showWordTimeoutId = setTimeout(
      () => setShowAnimatedWord(true),
      firstAnimatedWordDelayMs
    );
    const rotateWordsTimeoutId = setTimeout(
      () => setCanRotateWords(true),
      wordRotationDelayMs
    );

    return () => {
      clearTimeout(showWordTimeoutId);
      clearTimeout(rotateWordsTimeoutId);
    };
  }, []);

  useEffect(() => {
    if (!canRotateWords) return;

    const { waitAfter } = texts[index % texts.length];
    const intervalId = setInterval(
      () => setIndex((currentIndex) => currentIndex + 1),
      waitAfter
    );

    return () => clearInterval(intervalId);
  }, [canRotateWords, index, texts]);

  const currentText = texts[index % texts.length].value;

  return (
    <div className="flex w-full flex-col items-center gap-8 pb-[13.438rem] pt-[10.5rem] lg:items-start lg:pb-[11.625rem] lg:pt-[17rem]">
      <motion.section
        className="w-full font-gazpacho text-center text-[54px] font-medium leading-[50px] text-purple sm:text-[78px] sm:leading-[70px] lg:text-left lg:text-[85px] lg:leading-[76px]"
      >
        <div className="block lg:whitespace-nowrap">
          <AnimatedHeadlineText text="Onchain markets" />
        </div>
        <span className="inline-block">
          <AnimatedHeadlineText delay={0.28} text="made" />
        </span>
        <span className="relative ml-[0.18em] inline-block h-[1em] min-w-[4.25em] overflow-hidden align-top font-normal lg:min-w-[6.35em]">
          <AnimatePresence initial={false} mode="wait">
            {showAnimatedWord ? (
              <AnimatedHeadlineText
                key={currentText}
                animateExit
                className="absolute left-0 top-0 whitespace-nowrap"
                exitY={-14}
                letterDelay={0.018}
                text={currentText}
                y={14}
              />
            ) : null}
          </AnimatePresence>
        </span>
      </motion.section>
      <Paragraph
        size="large"
        className="max-w-[43rem] text-center text-[20px] leading-[1.2] text-purple lg:text-left lg:text-[24px]"
      >
        Hydration unites swaps, lending and the Hollar stablecoin under the roof
        of a scalable appchain.
      </Paragraph>
      <Button
        role="primary"
        decoration="arrow"
        action={{ href: "https://app.hydration.net", target: "_blank" }}
        className="w-[257px] rounded-[32px] [&>div]:w-full [&>div]:justify-between"
      >
        Launch app
      </Button>
    </div>
  );
}

function AnimatedHeadlineText({
  animateExit = false,
  className,
  delay = 0,
  exitY = -18,
  letterDelay = 0.032,
  text,
  y = 18,
}: {
  animateExit?: boolean;
  className?: string;
  delay?: number;
  exitY?: number;
  letterDelay?: number;
  text: string;
  y?: number;
}) {
  return (
    <motion.span aria-label={text} className={className}>
      {Array.from(text).map((letter, letterIndex) => (
        <motion.span
          aria-hidden="true"
          className="inline-block"
          initial={{ opacity: 0, y }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: delay + letterIndex * letterDelay,
              duration: 0.45,
              ease: headlineEase,
            },
          }}
          exit={
            animateExit
              ? {
                  opacity: 0,
                  y: exitY,
                  transition: {
                    duration: 0.2,
                    ease: headlineEase,
                  },
                }
              : undefined
          }
          key={`${letter}-${letterIndex}`}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
