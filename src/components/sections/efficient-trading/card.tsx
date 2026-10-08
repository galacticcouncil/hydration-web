"use client";

import AnimateOnView from "@/animation/motion-section";
import { fadeUp, slideIn } from "@/animation/variants";
import { ButtonProps } from "@/components/ui/buttons/button";
import Heading from "@/components/ui/typography/heading";
import Paragraph from "@/components/ui/typography/paragraph";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Variants, m } from "framer-motion";
import useScreenSize from "@/hooks/useScreenSize";

export type EfficientTradingCardProps = {
  icon: {
    src: StaticImport | string;
    alt: string;
  };
  title: string;
  description: string;
  buttons: React.ReactElement<ButtonProps>[];
  theme: "lavander" | "purple" | "blue" | "green";
  className?: string;
  cardAnimationVariants?: Variants;
};

function getColorClassName(theme: EfficientTradingCardProps["theme"]) {
  let className = "";
  switch (theme) {
    case "lavander":
      className = "bg-lavender text-purple";
      break;
    case "purple":
      className = "bg-purple text-lavender";
      break;
    case "blue":
      className = "bg-blue text-white";
      break;
    case "green":
      className = "bg-green text-white";
      break;
  }

  return className;
}

export default function EfficientTradingCard({
  icon,
  title,
  description,
  buttons,
  theme,
  className,
  cardAnimationVariants,
}: EfficientTradingCardProps) {
  const { width: screenWidth } = useScreenSize();
  const isMobile = screenWidth <= 1024;

  return (
    <AnimateOnView
      element="article"
      className={twMerge(
        "rounded-lg ~p-3/12 lg:h-[500px] xl:h-[441px]",
        getColorClassName(theme),
        className
      )}
      variants={cardAnimationVariants}
    >
      <m.div className="relative h-full w-full" variants={fadeUp()}>
        <div className="flex flex-col gap-4 pb-10 lg:pb-0">
          <Image src={icon.src} alt={icon.alt} className="~w-12/14 ~h-12/14" />
          <Heading
            size="medium"
            className={theme === "purple" ? "text-lavender" : "text-purple"}
          >
            {title}
          </Heading>
          <Paragraph
            size="large"
            className={twMerge(
              theme === "purple" ? "text-lavender" : "text-purple-dim",
              "mt-2"
            )}
          >
            {description}
          </Paragraph>
        </div>
        <div className="lg:absolute flex-col items-end md:flex-row bottom-0 left-0 flex gap-4 justify-end w-full">
          {buttons}
        </div>
      </m.div>
    </AnimateOnView>
  );
}
