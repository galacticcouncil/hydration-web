"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useLenis } from "@studio-freight/react-lenis";

const currentLinkColumns: LinkColumnProps[] = [
  {
    title: "Product",
    links: [
      {
        title: "Strategies",
        href: "#strategies",
      },
      {
        title: "Security",
        href: "#security",
      },
      {
        title: "HDX",
        href: "#hdx",
      },
    ],
  },

  {
    title: "Developers",
    links: [
      {
        title: "Docs",
        href: "https://docs.hydration.net/",
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
    <div className={twMerge("grid grid-cols-2 gap-y-12", className)}>
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

  return (
    <div className="flex flex-col gap-6">
      <h4
        className={twMerge(
          "font-geist font-medium text-purple-dim",
          dark && "text-lavender/55"
        )}
      >
        {title}
      </h4>
      {links.map((link) => (
        <div key={link.href}>
          <Link
            href={link.href}
            target={link.target}
            className={twMerge(
              "inline-block bg-purple-to-transparent bg-[bottom_left] bg-[length:0_2px] bg-no-repeat pb-[2px] font-geist text-base text-purple hover:bg-[bottom_right] hover:bg-[length:100%_2px]",
              dark &&
                "text-white/80 [background-image:linear-gradient(#DFB1F3_0_0)] hover:text-white"
            )}
            style={{
              transition: "background-size 0.3s, background-position 0s 0.3s",
            }}
            onClick={(e) => {
              if (link.target === "_blank") return;
              e.preventDefault();
              lenis?.scrollTo(link.href, {
                offset: version === "previous" ? 0 : sectionScrollOffset,
              });
            }}
          >
            {link.title}
          </Link>
        </div>
      ))}
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
