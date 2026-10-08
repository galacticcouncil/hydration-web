"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useLenis } from "@studio-freight/react-lenis";
import { usePrefersReducedMotion } from "@/animation/reduced-motion";

const currentLinkColumns: LinkColumnProps[] = [
  {
    title: "Socials",
    links: [
      { title: "X", href: "https://x.com/hydration_net", target: "_blank" },
      { title: "Discord", href: "https://discord.gg/kkmY35UxAG", target: "_blank" },
      { title: "Telegram", href: "https://t.me/hydration_net", target: "_blank" },
    ],
  },
  {
    title: "Developers",
    links: [
      { title: "Docs", href: "https://docs.hydration.net/", target: "_blank" },
      {
        title: "Github",
        href: "https://github.com/galacticcouncil",
        target: "_blank",
      },
      {
        title: "SDK",
        href: "https://github.com/galacticcouncil/sdk",
        target: "_blank",
      },
    ],
  },
];

const previousLinkColumns: LinkColumnProps[] = [
  {
    title: "Product",
    links: [
      { title: "Trade", href: "#trade" },
      { title: "Lend & Borrow", href: "#lend-borrow" },
    ],
  },
  {
    title: "Developers",
    links: [
      {
        title: "Docs",
        href: "https://docs.hydradx.io/",
        target: "_blank",
      },
      {
        title: "Github",
        href: "https://github.com/galacticcouncil",
        target: "_blank",
      },
      {
        title: "SDK",
        href: "https://github.com/galacticcouncil/sdk",
        target: "_blank",
      },
    ],
  },
];

type FooterLinksProps = {
  className?: string;
  version?: "current" | "previous";
  dark?: boolean;
};

const sectionScrollOffset = -88;

export default function FooterLinks({
  className,
  version = "current",
  dark = false,
}: FooterLinksProps) {
  const linkColumns =
    version === "previous" ? previousLinkColumns : currentLinkColumns;

  return (
    <div
      className={twMerge(
        "grid grid-cols-2 gap-x-8 gap-y-10",
        version === "current" && "md:grid-cols-[max-content_max-content] md:justify-center",
        className
      )}
    >
      {linkColumns.map((column) => (
        <LinkColumn
          key={column.title}
          version={version}
          dark={dark}
          {...column}
        />
      ))}
    </div>
  );
}

type LinkColumnProps = {
  title: string;
  version?: "current" | "previous";
  dark?: boolean;
  links: {
    title: string;
    href: string;
    target?: "_blank";
  }[];
};

function LinkColumn({
  title,
  links,
  version = "current",
  dark = false,
}: LinkColumnProps) {
  const lenis = useLenis();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className={twMerge("flex flex-col gap-6", version === "current" && "gap-3 md:flex-row md:items-baseline md:gap-8")}>
      <h3
        className={twMerge(
          "font-geist font-medium text-purple-dim",
          version === "current" && "shrink-0 text-sm text-purple/55",
          dark && "text-lavender/55"
        )}
      >
        {title}
      </h3>
      <div
        className={twMerge(
          "flex flex-col gap-6",
          version === "current" && "gap-0 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-3"
        )}
      >
      {links.map((link) => (
        <div key={link.href}>
          <Link
            href={link.href}
            target={link.target}
            rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
            className={
              version === "current"
                ? twMerge(
                    "inline-flex min-h-11 items-center rounded-sm font-geist text-base font-medium text-purple transition-colors md:min-h-0 hover:text-pink hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink",
                    dark && "text-white/80 hover:text-white focus-visible:outline-lavender"
                  )
                : twMerge(
                    "inline-block bg-purple-to-transparent bg-[bottom_left] bg-[length:0_2px] bg-no-repeat pb-[2px] font-geist text-base text-purple hover:bg-[bottom_right] hover:bg-[length:100%_2px]",
                    dark &&
                      "text-white/80 [background-image:linear-gradient(#DFB1F3_0_0)] hover:text-white"
                  )
            }
            style={
              version === "current"
                ? undefined
                : { transition: "background-size 0.3s, background-position 0s 0.3s" }
            }
            onClick={(e) => {
              if (link.target === "_blank") return;
              e.preventDefault();
              lenis?.scrollTo(link.href, {
                offset: version === "previous" ? 0 : sectionScrollOffset,
              immediate: reducedMotion,
              });
            }}
          >
            {link.title}
          </Link>
        </div>
      ))}
      </div>
    </div>
  );
}
// .un {
//    display: inline-block;
//    padding-bottom:2px;
//    background-image: linear-gradient(#000 0 0);
//    background-position: 0 100%; /*OR bottom left*/
//    background-size: 0% 2px;
//    background-repeat: no-repeat;
//    transition:
//      background-size 0.3s,
//      background-position 0s 0.3s; /*change after the size immediately*/
//  }

//  .un:hover {
//    background-position: 100% 100%; /*OR bottom right*/
//    background-size: 100% 2px;
//  }
