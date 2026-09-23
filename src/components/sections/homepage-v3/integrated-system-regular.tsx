"use client";

import { homepageCopy, appchainFeatures } from "@/content/homepage";

import Image from "next/image";
import { m } from "framer-motion";
import AnimateOnView from "@/animation/motion-section";
import { fadeUp, none, staggerChildren } from "@/animation/variants";
import Heading from "@/components/ui/typography/heading";
import Paragraph from "@/components/ui/typography/paragraph";
import AnimatedIllustration from "./animated-illustration";

// Endpoint positions and colors match the unmodified Figma export.
const branchEndpoints = [
  { top: 3.863, color: "#56D99C" },
  { top: 25.322, color: "#6A8FF0" },
  { top: 46.781, color: "#F17FB5" },
  { top: 70.386, color: "#C82BC2" },
  { top: 96.137, color: "#48D8EB" },
] as const;

export default function IntegratedSystemRegular() {
  const reveal = fadeUp(10);

  return (
    <div className="pb-16 pt-12 lg:pb-[200px] lg:pt-20">
      <AnimateOnView
        element="div"
        className="mx-auto flex max-w-[46rem] flex-col items-center text-center"
        variants={reveal}
        threshold={0.2}
      >
        <div aria-hidden="true" className="mb-7 flex h-16 items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-blue" />
          <span className="h-px w-8 bg-purple/10" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-purple/10 bg-white/60">
            <span className="absolute -left-1 top-2 h-2 w-2 rounded-full bg-green" />
            <Image
              src="/assets/why-hydration-logo.svg"
              alt=""
              width={30}
              height={31}
            />
            <span className="absolute -right-1 bottom-2 h-2 w-2 rounded-full bg-pink/50" />
          </div>
          <span className="h-px w-8 bg-purple/10" />
          <span className="h-2 w-2 rounded-full bg-lavender" />
        </div>
        <Heading
          size="large"
          animationVariants={none()}
          className="max-w-[18ch] text-balance text-purple lg:text-[3.25rem]"
        >
          {homepageCopy.why.title}
        </Heading>
        <div className="mt-7 max-w-[44rem] space-y-4">
          <Paragraph
            size="large"
            animationVariants={none()}
            className="text-balance text-purple/70"
          >
            {homepageCopy.why.paragraphs[0]}
          </Paragraph>
          <Paragraph
            size="large"
            animationVariants={none()}
            className="text-pretty text-purple/70"
          >
            {homepageCopy.why.paragraphs[1]}
          </Paragraph>
        </div>
      </AnimateOnView>

      <AnimateOnView
        className="mt-28 grid items-center gap-16 md:grid-cols-2 md:gap-12 lg:mt-40"
        variants={staggerChildren(0.1)}
        threshold={0.2}
      >
        <m.div className="max-w-[31rem] md:order-2" variants={reveal}>
          <h3 className="max-w-[17ch] text-balance font-gazpacho text-[2rem] font-medium leading-tight text-purple lg:text-[2.5rem]">
            {homepageCopy.integrated.title}
          </h3>
          <Paragraph
            size="large"
            animationVariants={none()}
            className="mt-4 text-purple/70"
          >
            {homepageCopy.integrated.paragraphs[0]}
          </Paragraph>
          <Paragraph
            size="large"
            animationVariants={none()}
            className="mt-3 text-purple/70"
          >
            {homepageCopy.integrated.paragraphs[1]}
          </Paragraph>
        </m.div>
        <m.div
          className="mx-auto w-full max-w-[26rem] md:order-1"
          variants={reveal}
        >
          <AnimatedIllustration
            src="/assets/why-hydration-integrated-grid.svg"
            animatedSrc="/assets/why-hydration-integrated-grid-animated.svg"
            alt="Connected colored tiles form one integrated financial system"
            width={402}
            height={267}
            className="h-auto w-full"
          />
        </m.div>
      </AnimateOnView>

      <AnimateOnView
        className="mt-8 md:mt-28 lg:mt-40"
        variants={staggerChildren(0.1)}
        threshold={0.2}
      >
        <m.div
          className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20"
          variants={reveal}
        >
          <div>
            <h3 className="text-balance font-gazpacho text-[2rem] font-medium leading-tight text-purple lg:text-[2.5rem]">
              {homepageCopy.appchain.title}
            </h3>
          </div>
          <Paragraph
            size="large"
            animationVariants={none()}
            className="max-w-[34rem] text-purple/70"
          >
            {homepageCopy.appchain.paragraphs[0]}
          </Paragraph>
        </m.div>

        <m.div className="mt-10 lg:mt-16" variants={staggerChildren(0.07)}>
          <div className="hidden w-full grid-cols-[0.9fr_1.1fr] gap-20 lg:grid">
            <m.div
              className="relative left-[3rem] aspect-[540/172] w-full"
              variants={reveal}
            >
              <AnimatedIllustration
                src="/assets/why-hydration-appchain-branches.svg"
                animatedSrc="/assets/why-hydration-appchain-branches-animated.svg"
                alt=""
                width={540}
                height={172}
                className="h-full w-full"
              />
            </m.div>
            <m.ul className="relative" variants={staggerChildren(0.07)}>
              {appchainFeatures.map((feature, index) => (
                <li
                  key={feature.label}
                  className="absolute left-0 right-0 -translate-y-1/2 font-geist text-base leading-snug text-purple xl:text-lg"
                  style={{ top: `${branchEndpoints[index].top}%` }}
                >
                  <m.span className="block" variants={reveal}>
                    {feature.label}
                  </m.span>
                </li>
              ))}
            </m.ul>
          </div>

          <div className="lg:hidden">
            <m.div
              className="relative mx-auto aspect-[540/172] w-full max-w-[36rem]"
              variants={reveal}
            >
              <AnimatedIllustration
                src="/assets/why-hydration-appchain-branches.svg"
                animatedSrc="/assets/why-hydration-appchain-branches-animated.svg"
                alt=""
                fill
                sizes="(max-width: 767px) calc(100vw - 48px), 576px"
                className="object-contain"
              />
            </m.div>
            <m.ul
              className="mt-10 grid gap-x-8 gap-y-4 md:grid-cols-2"
              variants={staggerChildren(0.07)}
            >
              {appchainFeatures.map((feature, index) => (
                <m.li
                  key={feature.label}
                  variants={reveal}
                  className="flex items-center gap-3 font-geist text-base leading-snug text-purple"
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: branchEndpoints[index].color }}
                  />
                  {feature.label}
                </m.li>
              ))}
            </m.ul>
          </div>
        </m.div>
      </AnimateOnView>
    </div>
  );
}
