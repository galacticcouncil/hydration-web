"use client";

import React from "react";
import ArchBackground from "./assets/arch.svg";
import Image from "next/image";
import Heading from "@/components/ui/typography/heading";
import Paragraph from "@/components/ui/typography/paragraph";
import { twMerge } from "tailwind-merge";
import AnimateOnView from "@/animation/motion-section";
import { fadeUp, scaleUp } from "@/animation/variants";
import { m } from "framer-motion";

type ArchProps =
  | {
      empty: false;
      title: string;
      description: string;
      Icon: React.ReactNode;
      className?: string;
      children?: React.ReactNode;
    }
  | {
      empty: true;
      className?: string;
      children?: React.ReactNode;
    };

export default function Arch(props: ArchProps) {
  return (
    <div
      className={twMerge("relative lg:w-[584px] lg:h-[705px]", props.className)}
    >
      {props.children}
      <Image
        src={ArchBackground}
        className="z-[5] scale-y-[120%] [@media(min-width:400px)]:scale-y-100"
        alt="Arch"
        layout="fill"
        objectFit="contain"
      />
      {!props.empty && (
        <AnimateOnView
          element="div"
          className="flex flex-col ~gap-8/16 justify-center items-center text-center p-12 lg:p-0"
        >
          <m.div
            variants={scaleUp()}
            className="~w-[8.75rem]/[16.25rem] mx-auto pt-0 lg:pt-20 z-10"
          >
            {props.Icon}
          </m.div>
          <m.div
            variants={fadeUp()}
            className="flex flex-col gap-8 max-w-[300px] lg:max-w-[415px] lg:mx-8 z-10"
          >
            <Heading size="large" className="text-purple">
              {props.title}
            </Heading>
            <Paragraph size="large" className="text-purple-dim">
              {props.description}
            </Paragraph>
          </m.div>
        </AnimateOnView>
      )}
    </div>
  );
}
