"use client";

import { homepageCopy, securityGroups } from "@/content/homepage";

import AnimateOnView from "@/animation/motion-section";
import { fadeUp, revealStagger } from "@/animation/variants";
import ScrollAnchor from "@/components/scroll-anchor";
import Image from "next/image";
import {
  m,
  useScroll,
  useTransform,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/animation/reduced-motion";
import { useRef } from "react";

type SecurityGroup = {
  title: string;
  icon: string;
  mechanisms: readonly string[];
};

export default function SecurityFeature() {
  return (
    <AnimateOnView
      className="overflow-hidden bg-white"
      variants={revealStagger(0.08, 18)}
      threshold={0.08}
      viewportMargin="0px 0px -10% 0px"
    >
      <section className="relative">
        <ScrollAnchor id="security" />
        <OriginalSecurityLayout />
      </section>
    </AnimateOnView>
  );
}

function OriginalSecurityLayout() {
  return (
    <>
      <div className="container mx-auto w-full px-6 pt-10 md:px-[50px] md:pt-12 lg:pt-16 xl:px-16">
        <SecurityIntro className="lg:pb-9 lg:pr-[70px]" />

        <m.div
          className="relative mt-12 grid before:pointer-events-none before:absolute before:left-1/2 before:top-0 before:h-px before:w-screen before:-translate-x-1/2 before:bg-purple/15 md:grid-cols-2 lg:grid-cols-4"
          variants={revealStagger(0.06, 14)}
        >
          {securityGroups.map((group, groupIndex) => (
            <SecurityColumn
              key={group.title}
              {...group}
              groupIndex={groupIndex}
            />
          ))}
        </m.div>
      </div>

      <SecurityPhoto />
    </>
  );
}

function SecurityIntro({ className = "" }: { className?: string }) {
  return (
    <m.div
      className={`mx-auto flex w-full max-w-[900px] flex-col items-center gap-5 text-center ${className}`}
      variants={revealStagger(0.12, 18)}
    >
      <m.h2
        className="max-w-[14ch] font-gazpacho text-[2.55rem] font-medium leading-[1.06] text-purple md:text-5xl md:leading-[1.2]"
        variants={fadeUp(18)}
      >
        {homepageCopy.security.title}
      </m.h2>
      <m.p
        className="max-w-[718px] font-geist text-base leading-[1.55] text-purple-dim md:text-[1.115rem]"
        variants={fadeUp(14)}
      >
        {homepageCopy.security.paragraphs[0]}
        <span className="block">
          {homepageCopy.security.paragraphs[1]}
        </span>
      </m.p>
    </m.div>
  );
}

function SecurityPhoto() {
  const photoRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.82, 1],
    [1, 1.065, 1.065],
  );

  return (
    <m.div
      ref={photoRef}
      className="relative aspect-[1780/635] min-h-[25rem] w-full overflow-hidden sm:min-h-[28rem]"
      variants={fadeUp(16)}
    >
      <m.div
        className="absolute inset-0 will-change-transform"
        style={{
          y: reducedMotion ? 0 : imageY,
          scale: reducedMotion ? 1 : imageScale,
        }}
      >
        <Image
          src="/assets/security-vending-machine.png"
          alt="A Hydration vending machine set into a concrete pavilion beside the sea"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </m.div>
    </m.div>
  );
}

function SecurityColumn({
  title,
  icon,
  mechanisms,
  groupIndex,
}: SecurityGroup & { groupIndex: number }) {
  return (
    <m.article
      className={`min-h-[17rem] border-b border-purple/15 px-0 py-7 md:min-h-[19rem] md:px-7 lg:min-h-[388px] lg:border-b-0 ${
        groupIndex % 2 === 1 ? "md:border-l" : ""
      } ${groupIndex > 0 ? "lg:border-l" : "lg:pl-0"}`}
      variants={fadeUp(12)}
    >
      <Image src={icon} alt="" width={32} height={32} aria-hidden="true" />
      <h3 className="mt-5 w-full font-gazpacho text-[1.35rem] font-medium leading-none text-purple">
        {title}
      </h3>
      <ul className="mt-5 space-y-3.5">
        {mechanisms.map((mechanism) => (
          <li
            key={mechanism}
            className="flex items-start gap-3 font-geist text-[0.88rem] leading-[1.35] text-purple-dim"
          >
            <Image
              src="/assets/security-bullet.svg"
              alt=""
              width={10}
              height={10}
              className="mt-[0.34em] shrink-0"
              aria-hidden="true"
            />
            <span>{mechanism}</span>
          </li>
        ))}
      </ul>
    </m.article>
  );
}
