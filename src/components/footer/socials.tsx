"use client";

import MediumLogo from "./assets/medium.svg";
import TwitterLogo from "./assets/twitter.svg";
import XLogo from "./assets/x.svg";
import DiscordLogo from "./assets/discord.svg";
import TelegramLogo from "./assets/telegram.svg";
import GithubLogo from "./assets/github.svg";
import SubstackLogo from "./assets/substack.svg";
import Link from "next/link";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { fadeUp } from "@/animation/variants";

const socials = [
  {
    name: "Substack",
    href: "https://hydration.substack.com/",
    logo: SubstackLogo,
  },
  {
    name: "Twitter",
    href: "https://x.com/hydration_net",
    logo: XLogo,
  },
  {
    name: "Discord",
    href: "https://discord.gg/kkmY35UxAG",
    logo: DiscordLogo,
  },
  {
    name: "Telegram",
    href: "https://t.me/hydration_net",
    logo: TelegramLogo,
  },
  {
    name: "Github",
    href: "https://github.com/galacticcouncil",
    logo: GithubLogo,
  },
];

type Props = {
  className?: string;
  dark?: boolean;
};

export default function Socials({ className, dark = false }: Props) {
  return (
    <motion.div
      className={twMerge("flex gap-4 items-center lg:gap-8", className)}
      variants={fadeUp()}
    >
      {socials.map((social) => (
        <Link
          key={social.name}
          href={social.href}
          target="_blank"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 lg:h-7 lg:w-7"
        >
          <Image
            src={social.logo}
            alt={social.name}
            width={28}
            height={28}
            className={dark ? "brightness-0 invert opacity-75" : undefined}
          />
        </Link>
      ))}
    </motion.div>
  );
}
