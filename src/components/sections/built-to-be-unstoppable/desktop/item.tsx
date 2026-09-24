import Paragraph from "@/components/ui/typography/paragraph";
import Title from "@/components/ui/typography/title";
import { twMerge } from "tailwind-merge";
import { m } from "framer-motion";
import { staggerChildren } from "@/animation/variants";

export type ItemProps = {
  title: string;
  description: string;
  align: "left" | "right";
};

export default function Item({ align, title, description }: ItemProps) {
  return (
    <m.div
      className={twMerge(
        "flex flex-col gap-4",
        align === "left" ? "text-left" : "text-right"
      )}
      variants={staggerChildren(0)}
    >
      <div
        className={twMerge(
          "h-[111px] border-[#E53E7640] mb-[0.875rem]",
          align === "left" ? "border-l-2" : "border-r-2"
        )}
      />
      <Title size="small">{title}</Title>
      <Paragraph
        size="medium"
        className={twMerge(
          "text-purple-dim max-w-[250px]",
          align === "left" ? "" : "ml-auto"
        )}
      >
        {description}
      </Paragraph>
    </m.div>
  );
}
