"use client";
import SectionLabel from "@/components/ui/labels/section";
import DevsAndSecurityItem, { DevsAndSecurityItemProps } from "./item";

import Heading from "@/components/ui/typography/heading";
import Paragraph from "@/components/ui/typography/paragraph";
import LockIcon from "./icons/lock";
import CodeIcon from "./icons/code";
import GithubIcon from "./icons/github";
import DocumentIcon from "./icons/document";
import AnimateOnView from "@/animation/motion-section";
import { m } from "framer-motion";
import { staggerChildren } from "@/animation/variants";
import useProgressiveImage from "@/hooks/useProgressiveImage";
import ScrollAnchor from "@/components/scroll-anchor";
import { useRef } from "react";

const items: DevsAndSecurityItemProps[] = [
  {
    title: "Hydration security",
    description: "Find and report vulnerabilities, receive generous rewards.",
    icon: LockIcon,
    href: "https://github.com/galacticcouncil/HydraDX-security",
  },
  {
    title: "SDK for frontend applications",
    description:
      "Utilize our SDK to streamline frontend development and enhance user experiences.",
    icon: CodeIcon,
    href: "https://github.com/galacticcouncil/sdk",
  },
  {
    title: "Github",
    description:
      "Explore our open-source repository for collaborative development and access to essential resources.",
    icon: GithubIcon,
    href: "https://github.com/galacticcouncil",
  },
  {
    title: "Developer docs",
    description:
      "Access comprehensive documentation for seamless integration and optimization of our APIs.",
    icon: DocumentIcon,
    href: "https://apidocs.bsx.fi/HydraDX",
  },
];

export default function DevsAndSecuritySection() {
  const sectionRef = useRef(null);
  const imageSrc = useProgressiveImage({
    src: "/pool.webp",
    placeholderSrc: "/pool-placeholder.webp",
    sectionRef,
  });

  return (
    <AnimateOnView
      className="relative w-full overflow-hidden lg:bg-cover bg-[length:auto_120%]  bg-[center_calc(30%)] md:bg-[center_top] bg-no-repeat"
      style={{
        backgroundImage: `url(${imageSrc})`,
      }}
    >
      {/* <Image
        src={PoolImage}
        alt="Pool"
        //   objectFit="cover"
        className="-translate-y-10 h-[110%] top-0 bottom-0 absolute object-center w-[180%] -translate-x-[20%] max-w-none"
      /> */}
      <div className="mx-auto container relative" ref={sectionRef}>
        <ScrollAnchor id="devs" />
        <div className="~pt-[4rem]/[16.938rem] flex ~gap-8/6 flex-col items-center max-w-[550px] relative z-10 mx-auto">
          <SectionLabel captionClassName="text-blue" iconClassName="bg-blue">
            Developers and Security
          </SectionLabel>
          <Heading className="text-center text-white" size="large">
            Help build the
            <br className="hidden lg:inline" />
            future of finance
          </Heading>
          <Paragraph size="large" className="text-white text-center">
            Hydration provides the liquidity layer which empowers developers to
            build the financial apps of tomorrow.
          </Paragraph>
        </div>
      </div>
      <m.div
        variants={staggerChildren(0.2)}
        className="~pt-8/16 ~pb-16/[16.938rem] flex flex-col gap-4 items-center z-10 relative container mx-auto"
      >
        {items.map((item) => (
          <DevsAndSecurityItem key={item.title} {...item} />
        ))}
      </m.div>
    </AnimateOnView>
  );
}
