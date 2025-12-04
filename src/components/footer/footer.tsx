import { twMerge } from "tailwind-merge";
import SecuredByBadge from "../badges/securedByBadge";
import Logo from "../icons/logo";
import Paragraph from "../ui/typography/paragraph";
import FooterLinks from "./links";
import Socials from "./socials";
import SubscribeToNewsletter from "./subscribe";
import Legal from "./legal";

export default function Footer() {
  return (
    <footer className="bg-lavender">
      <div className="pt-16 grid grid-cols-1 lg:grid-cols-2 pb-8 gap-y-11 container mx-auto">
        <Logo className="order-1" size="large" />
        <Socials className="order-4 lg:order-2" />
        <SubscribeToNewsletter className="order-2 lg:order-3" />
        <FooterLinks className="order-3 lg:order-4" />
        <SecuredByBadge className="order-5" />
        <div className="flex justify-between lg:items-center items-start order-6 flex-col-reverse lg:flex-row gap-2">
          <Legal />
          <RightsReserved />
        </div>
      </div>
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

