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
  const isDark = version === "current";

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
