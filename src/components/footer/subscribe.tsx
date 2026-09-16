import { twMerge } from "tailwind-merge";
import Button from "../ui/buttons/button";
import Input from "../ui/input/input";

type Props = {
  className?: string;
  dark?: boolean;
};

export default function SubscribeToNewsletter({
  className,
  dark = false,
}: Props) {
  return (
    <div className={twMerge("flex flex-col gap-4 mt-4 lg:mt-0", className)}>
      <p
        className={twMerge(
          "font-inter font-medium leading-5 text-purple lg:text-purple-dim",
          dark && "text-white/60 lg:text-white/60"
        )}
      >
        Get the latest from Hydration
      </p>
      <form
        className={twMerge(
          "flex h-[3.25rem] justify-between gap-2 rounded-xl bg-beige p-1 sm:h-12 sm:max-w-[22.7rem] sm:gap-4",
          dark && "border border-white/15 bg-white/[0.06]"
        )}
      >
        <Input
          placeholder="Email address"
          className={twMerge(
            "min-w-0 px-3 sm:px-4",
            dark &&
              "bg-transparent text-white placeholder:text-white/35 focus:outline-none"
          )}
        />
        <Button
          role="primary"
          decoration="arrow"
          className={twMerge(
            "min-w-[7rem] py-2",
            dark &&
              "hover:bg-lavender hover:text-purple active:bg-lavender active:text-purple"
          )}
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
}
