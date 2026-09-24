"use client";

import Arrow from "@/components/icons/arrow";
import Star from "@/components/icons/star";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import { m } from "framer-motion";
import { fadeUp } from "@/animation/variants";

type ButtonAction =
  | {
      onClick: () => {};
    }
  | {
      href: string;
      target?: "_blank";
    };

type Decoration = "arrow" | "star";

function getButtonStyles(
  role: "primary" | "secondary",
  fill: "solid" | "outline"
) {
  let className = "";
  if (role === "primary") {
    if (fill === "solid") {
      className =
        "bg-pink text-white hover:bg-purple active:bg-purple active:text-purple disabled:text-white disabled:bg-[#B4ADAF] ";
      return className;
    }
    if (fill === "outline") {
      className =
        "border text-purple border-pink hover:text-pink active:border-purple active:text-purple disabled:text-[#B4ADAF] disabled:border-[#B4ADAF]";
      return className;
    }
  }
  if (role === "secondary") {
    if (fill === "solid") {
      className =
        "bg-beige text-purple hover:text-pink active:text-purple disabled:bg-[#F6F6F6] disabled:text-[#240E3259]";
      return className;
    }
    if (fill === "outline") {
      className =
        "border border-white hover:border-purple hover:text-purple active:text-white active:border-white disabled:text-[#FFFFFF80] disabled:border-[#FFFFFF80]";
      return className;
    }
  }
}

export type ButtonProps = {
  role: "primary" | "secondary";
  children: React.ReactNode;
  fill?: "solid" | "outline";
  action?: ButtonAction;
  decoration?: Decoration;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  role,
  fill = "solid",
  action,
  decoration,
  children,
  disabled = false,
  className,
}: ButtonProps) {
  const colorClassName = getButtonStyles(role, fill);
  return (
    <m.div variants={fadeUp()}>
      <ButtonWrapper action={action}>
        <button
          className={twMerge(
            colorClassName,
            "cursor-pointer rounded-xl px-5 py-3 font-geist text-base leading-6 font-normal transition-colors",
            className
          )}
          disabled={disabled}
        >
          <ButtonContent decoration={decoration}>{children}</ButtonContent>
        </button>
      </ButtonWrapper>
    </m.div>
  );
}

function ButtonWrapper({
  action,
  children,
}: {
  action?: ButtonAction;
  children: React.ReactNode;
}) {
  if (action === undefined) {
    return children;
  }

  if ("href" in action) {
    return (
      <Link href={action.href} target={action.target}>
        {children}
      </Link>
    );
  }
}

function ButtonContent({
  children,
  decoration,
}: {
  children: React.ReactNode;
  decoration?: Decoration;
}) {
  if (decoration === "arrow") {
    return (
      <div className="flex items-center gap-2.5">
        {children} <Arrow />
      </div>
    );
  }

  if (decoration === "star") {
    return (
      <div className="flex items-center gap-2.5">
        <Star />
        {children}
        <Star />
      </div>
    );
  }

  return children;
}
