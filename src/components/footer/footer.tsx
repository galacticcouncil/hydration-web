import { twMerge } from "tailwind-merge";
import Logo from "../icons/logo";
import Paragraph from "../ui/typography/paragraph";
import RevealOnView from "../ui/reveal-on-view";
import FooterLinks from "./links";
import Socials from "./socials";
import SubscribeToNewsletter from "./subscribe";
import Legal from "./legal";

export default function Footer({
  version = "current",
}: {
  version?: "current" | "previous";
}) {
  if (version === "current") {
    return (
      <footer className="overflow-hidden border-t border-lavender/15 bg-purple text-white">
        <RevealOnView className="container mx-auto">
          <div className="flex flex-col items-center gap-[2.5rem] pt-24 text-center md:pt-28">
            <h2 className="max-w-full font-gazpacho text-[clamp(2rem,10vw,2.75rem)] font-medium leading-[1.06] text-lavender sm:text-[clamp(2.75rem,5vw,5.5rem)]">
              <span className="block whitespace-nowrap">Get the latest</span>{" "}
              <span className="block whitespace-nowrap">from Hydration</span>
            </h2>
            <SubscribeToNewsletter className="mt-0 items-center" dark showLabel={false} />
          </div>

          <FooterLinks className="mx-auto mt-24 max-w-[56rem] md:mt-28 md:gap-x-16" version="current" dark />

          <div className="mt-16 flex flex-col items-center gap-4 border-t border-lavender/15 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <Legal dark />
            <RightsReserved className="text-lavender/55" />
          </div>
        </RevealOnView>

        <div aria-hidden="true" className="relative mt-5 aspect-[168/23] overflow-hidden sm:aspect-[42/5]">
          <Logo
            size="large"
            className="absolute left-1/2 top-0 h-auto w-[115%] max-w-none -translate-x-1/2 sm:w-full [&_path]:fill-lavender/15"
          />
        </div>
      </footer>
    );
  }

  const isDark = false;

  return (
    <footer
      className={twMerge(
        "bg-lavender",
        isDark && "border-t border-lavender/15 bg-purple text-white"
      )}
    >
      <RevealOnView className="container mx-auto">
        <div className="grid grid-cols-1 gap-y-11 pb-8 pt-16 lg:grid-cols-2">
        <Logo
          className={twMerge(
            "order-1",
            isDark && "[&_path]:fill-lavender"
          )}
          size="large"
        />
        <Socials
          className="order-4 lg:order-2"
          dark={isDark}
        />
        <SubscribeToNewsletter
          className="order-2 lg:order-3"
          dark={isDark}
        />
        <FooterLinks
          className="order-3 lg:order-4"
          version={version}
          dark={isDark}
        />
        <div className="order-6 flex flex-col-reverse items-start justify-between gap-2 lg:col-span-2 lg:flex-row lg:items-center">
          <Legal dark={isDark} />
          <RightsReserved className={isDark ? "text-white/50" : undefined} />
        </div>
        </div>
      </RevealOnView>
    </footer>
  );
}

type Props = {
  className?: string;
};

function RightsReserved({ className }: Props) {
  return (
    <Paragraph size="small" className={className}>
      ©{new Date().getFullYear()} Hydration, All rights reserved
    </Paragraph>
  );
}
