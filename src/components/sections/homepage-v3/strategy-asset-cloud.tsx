"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import Bitcoin from "@/components/sections/bring-your-own-gas/assets/bitcoin.svg";
import Ethereum from "@/components/sections/bring-your-own-gas/assets/ethereum.svg";
import Usdc from "@/components/sections/bring-your-own-gas/assets/usdc.svg";
import Tether from "@/components/sections/bring-your-own-gas/assets/tether.svg";
import Hydration from "@/components/sections/bring-your-own-gas/assets/hydration.svg";
import Hollar from "@/components/sections/bring-your-own-gas/assets/hollar.svg";
import Polkadot from "@/components/sections/bring-your-own-gas/assets/polkadot.svg";
import styles from "./strategy-asset-cloud.module.css";

type MarqueeItem = {
  label: string;
  images: (string | StaticImageData)[];
  tokenOnly?: boolean;
};

// Product names and actions follow hydration-ui's dashboard opportunities,
// strategy pages, and BIL borrowing flow. These are examples, without live rates.
const opportunityRows: MarqueeItem[][] = [
  [
    { label: "Provide ETH liquidity", images: [Ethereum] },
    { label: "Borrow HOLLAR", images: [Hollar] },
    { label: "Bitcoin", images: [Bitcoin], tokenOnly: true },
    { label: "Earn with HOLLAR Bonds", images: [Hollar] },
    { label: "Provide DOT liquidity", images: [Polkadot] },
    { label: "Hydration", images: [Hydration], tokenOnly: true },
  ],
  [
    { label: "Earn with BIL", images: ["/assets/strategies/bil.svg"] },
    { label: "USDC", images: [Usdc], tokenOnly: true },
    { label: "Provide Omnipool liquidity", images: [Ethereum, Polkadot] },
    { label: "Provide stablecoin liquidity", images: [Usdc, Tether] },
    {
      label: "PRIME",
      images: ["/assets/strategies/prime.png"],
      tokenOnly: true,
    },
    {
      label: "Borrow against BIL",
      images: ["/assets/strategies/bil.svg", Hollar],
    },
  ],
];

export default function StrategyAssetCloud() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.1 });
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={containerRef}
      className={styles.marquee}
      data-paused={!isInView || !!reducedMotion}
    >
      <ul className="sr-only" aria-label="Ways to put your capital to work">
        {opportunityRows
          .flat()
          .filter((item) => !item.tokenOnly)
          .map((item) => (
            <li key={item.label}>{item.label}</li>
          ))}
      </ul>

      <div className={styles.lanes} aria-hidden="true">
        {opportunityRows.map((items, rowIndex) => (
          <div key={rowIndex} className={styles.lane}>
            <div className={styles.track}>
              {[0, 1].map((copy) => (
                <div key={copy} className={styles.group} data-copy={copy}>
                  {items.map((item) => (
                    <div
                      key={item.label}
                      className={`flex shrink-0 items-center rounded-full border border-purple/[0.08] bg-white shadow-[0_8px_24px_-16px_rgba(36,14,50,0.2)] ${
                        item.tokenOnly
                          ? "justify-center p-4 md:p-5"
                          : "gap-4 px-5 py-4 md:px-7 md:py-5"
                      }`}
                    >
                      <div className="flex shrink-0 -space-x-3">
                        {item.images.map((src, index) => (
                          <Image
                            key={index}
                            src={src}
                            alt=""
                            width={48}
                            height={48}
                            draggable={false}
                            className="h-10 w-10 rounded-full ring-[3px] ring-white md:h-12 md:w-12"
                          />
                        ))}
                      </div>
                      {!item.tokenOnly && (
                        <span className="whitespace-nowrap font-geist text-base font-medium leading-tight text-purple md:text-lg">
                          {item.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
