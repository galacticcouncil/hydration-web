import React, { useState } from "react";
import Title from "@/components/ui/typography/title";
import Paragraph from "@/components/ui/typography/paragraph";
import { m } from "framer-motion";
import { fadeUp } from "@/animation/variants";
import ExternalLink from "@/components/ui/external-link";
import { twMerge } from "tailwind-merge";

export type DevsAndSecurityItemProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

export default function DevsAndSecurityItem({
  title,
  description,
  icon: Icon,
  href,
}: DevsAndSecurityItemProps) {
  const [hoverAnimationActive, setHoverAnimationActive] = useState(false);
  return (
    <ExternalLink href={href}>
      <m.div
        variants={fadeUp()}
        onAnimationComplete={() => setHoverAnimationActive(true)}
        className={twMerge(
          "flex justify-between gap-5 p-2 bg-white rounded-md border border-blue group",
          hoverAnimationActive
            ? "lg:hover:shadow-white-outset  lg:transition"
            : ""
        )}
      >
        <div className="rounded-sm bg-white shadow-blue-inset min-w-[4.875rem] w-[4.875rem] md:h-[6.125rem] flex justify-center items-center">
          <Icon className="transition-all text-blue group-hover:text-purple" />
        </div>
        <div className="flex flex-col ~gap-3/4 max-w-[351px]">
          <Title size="small" className="font-geist md:font-gazpacho ~pt-1.5/3">
            {title}
          </Title>
          <Paragraph className="text-purple-dim" size="small">
            {description}
          </Paragraph>
        </div>
      </m.div>
    </ExternalLink>
  );
}
