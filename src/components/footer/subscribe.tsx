import { twMerge } from "tailwind-merge";
import Arrow from "../icons/arrow";
import ExternalLink from "../ui/external-link";

type Props = {
  className?: string;
  dark?: boolean;
  showLabel?: boolean;
};

export default function SubscribeToNewsletter({
  className,
  dark = false,
  showLabel = true,
}: Props) {
  return (
    <div className={twMerge("flex flex-col gap-4 mt-4 lg:mt-0", className)}>
      {showLabel ? (
        <p
          className={twMerge(
            "font-inter font-medium leading-5 text-purple lg:text-purple-dim",
            dark && "text-white/60 lg:text-white/60"
          )}
        >
          Get the latest from Hydration
        </p>
      ) : null}
      <ExternalLink
        href="https://hydration.substack.com/"
        className={twMerge(
          "inline-flex w-fit items-center gap-2.5 rounded-xl bg-pink px-5 py-3 font-geist text-base leading-6 text-white transition-colors hover:bg-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink",
          dark && "footer-blog-cta font-normal hover:bg-lavender hover:text-purple"
        )}
      >
        Follow our blog
        <span aria-hidden="true">
          <Arrow />
        </span>
      </ExternalLink>
    </div>
  );
}
