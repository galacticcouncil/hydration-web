import React from "react";
// import CentrifugeIcon from "./assets/centrifuge.svg";
import SolanaIcon from "./assets/solana.svg";
// import DaiIcon from "./assets/dai.svg";
import AaveIcon from "./assets/aave.svg";
import HydrationIcon from "./assets/hydration.svg";
import PhalaIcon from "./assets/phala.svg";
import PolkadotIcon from "./assets/polkadot.svg";
import TetherIcon from "./assets/tether.svg";
import UsdcIcon from "./assets/usdc.svg";
import BitcoinIcon from "./assets/bitcoin.svg";
// import KiltIcon from "./assets/kilt.svg";
import HollarIcon from "./assets/hollar.svg";
import EthereumIcon from "./assets/ethereum.svg";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { twMerge } from "tailwind-merge";
import Heading from "@/components/ui/typography/heading";
import { m } from "framer-motion";
import { fadeUp, none, scaleUp, staggerChildren } from "@/animation/variants";

export default function Galaxy() {
  return (
    <m.div
      className="w-[110%] -ml-[5%] md:ml-auto md:w-[full] mx-auto max-w-[750px] aspect-square relative bg-white"
      variants={scaleUp()}
    >
      <FirstRank />
      <SecondRank />
      <ThirdRank />
      <FourthRank />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-[500px] z-20">
        <m.div variants={fadeUp()}>
          <Heading
            className="~text-[1.5rem]/4xl text-center"
            size="medium"
            animationVariants={none()}
          >
            Bring your own gas
          </Heading>
          <Heading
            className="~text-[1.5rem]/4xl text-center font-normal italic"
            size="medium"
            animationVariants={none()}
          >
            pay transaction fees using
          </Heading>
          <Heading
            className="~text-[1.5rem]/4xl text-center font-normal italic"
            size="medium"
            animationVariants={none()}
          >
            any supported asset
          </Heading>
        </m.div>
      </div>
    </m.div>
  );
}

function FirstRank() {
  const size = 90;
  const secondsPerSpin = 50;
  const elements = [
    //  { image: CentrifugeIcon, alt: "Centrifuge", offsetPercentage: 0 },
    { image: SolanaIcon, alt: "Solana", offsetPercentage: 0 },
    { image: HydrationIcon, alt: "Hydration", offsetPercentage: 11 },
    { image: PolkadotIcon, alt: "Polkadot", offsetPercentage: 27 },
    { image: EthereumIcon, alt: "Ethereum", offsetPercentage: 43 },
    { image: PhalaIcon, alt: "Phala", offsetPercentage: 59 },
    //  { image: KiltIcon, alt: "Kilt", offsetPercentage: 70 },
    { image: AaveIcon, alt: "Aave", offsetPercentage: 70 },
  ];

  return (
    <>
      <Orbit
        size={size}
        secondsPerSpin={secondsPerSpin}
        className="border border-[#DFB1F340]"
      />
      {elements.map((element) => (
        <Orbit
          key={element.alt}
          size={size}
          secondsPerSpin={secondsPerSpin}
          offsetPercentage={element.offsetPercentage}
          element={element}
        />
      ))}
    </>
  );
}

function SecondRank() {
  const size = 70;
  const secondsPerSpin = 30;

  const elements = [
    { image: HollarIcon, alt: "Hollar", offsetPercentage: 0 },
    { image: TetherIcon, alt: "Tether", offsetPercentage: 23 },
    { image: BitcoinIcon, alt: "Bitcoin", offsetPercentage: 56 },
  ];

  return (
    <>
      <Orbit
        size={size}
        secondsPerSpin={secondsPerSpin}
        className="border border-[#DFB1F380]"
      />
      {elements.map((element) => (
        <Orbit
          key={element.alt}
          size={size}
          secondsPerSpin={secondsPerSpin}
          offsetPercentage={element.offsetPercentage}
          element={element}
        />
      ))}
    </>
  );
}

function ThirdRank() {
  const size = 50;
  const secondsPerSpin = 40;

  const elements = [{ image: UsdcIcon, alt: "Usdc", offsetPercentage: 0 }];

  return (
    <>
      <Orbit
        size={size}
        secondsPerSpin={secondsPerSpin}
        className="border border-[#DFB1F3BF]"
      />
      {elements.map((element) => (
        <Orbit
          key={element.alt}
          size={size}
          secondsPerSpin={secondsPerSpin}
          offsetPercentage={element.offsetPercentage}
          element={element}
        />
      ))}
    </>
  );
}

function FourthRank() {
  const size = 30;
  const secondsPerSpin = 50;

  return (
    <>
      <Orbit
        size={size}
        secondsPerSpin={secondsPerSpin}
        className="border border-lavender"
      />
    </>
  );
}

type OrbitProps = {
  size: number;
  secondsPerSpin?: number;
  offsetPercentage?: number;
  element?: {
    image: StaticImport;
    alt: string;
  };
  borderOpacity?: number;
  className?: string;
};

function Orbit({
  size,
  secondsPerSpin = 1,
  offsetPercentage = 0,
  element,
  className,
}: OrbitProps) {
  const pos = `${(size - 30) / 12 + 5}%`;
  return (
    <div
      className={twMerge(
        "absolute rounded-full animate-spin",
        className,
        element && "z-20"
      )}
      style={{
        width: `${size}%`,
        height: `${size}%`,
        left: `calc(50% - ${size}% / 2)`,
        top: `calc(50% - ${size}% / 2)`,
        animationDuration: `${secondsPerSpin}s`,
        animationDelay: `-${secondsPerSpin * (offsetPercentage / 100)}s`,
      }}
    >
      {element && (
        <div
          className="absolute ~w-[2rem]/[4rem] ~h-[2rem]/[4rem] bg-blue rounded-full animate-counter-spin "
          style={{
            // apply counter rotation to make the element appear stationary
            animationDuration: `${secondsPerSpin}s`,
            animationDelay: `-${secondsPerSpin * (offsetPercentage / 100)}s`,
            top: pos,
            left: pos,
          }}
        >
          <Image
            src={element.image}
            alt={element.alt}
            // width={64}
            // height={64}
            className="~w-[2rem]/[4rem] ~h-[2rem]/[4rem]"
          />
        </div>
      )}
    </div>
  );
}
