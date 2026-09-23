import { twMerge } from "tailwind-merge";
import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input">;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={twMerge(
        "rounded-xl px-4 py-3 font-geist font-normal text-base leading-6 bg-beige text-purple",
        className
      )}
      {...props}
    />
  );
}
