"use client";

import Image from "next/image";
import Badge from "./badge";
import ExternalLink from "@/components/ui/external-link";

import MetaMaskLogo from "./assets/metamask.svg";
import NovaLogo from "./assets/nova.png";
import SubwalletLogo from "./assets/subwallet.svg";
import TalismanLogo from "./assets/talisman.svg";
import LedgerLogo from "./assets/ledger.webp";
import { m } from "framer-motion";
import { fadeIn, fadeUp } from "@/animation/variants";

export default function SupportingBadge() {
  return (
    <m.div variants={fadeUp()}>
      <Badge className="pr-1">
        Supporting <Icons />
      </Badge>
    </m.div>
  );
}

function Icons() {
  return (
    <div className="flex gap-1 py-1 pl-1">
      <ExternalLink
        href="https://metamask.io"
      >
        <Image
          className="transition-transform will-change-transform hover:scale-105"
          width={32}
          height={32}
          src={MetaMaskLogo}
          alt="MetaMask - The Ultimate Crypto Wallet for DeFi, Web3 Apps, and NFTs"
        />
      </ExternalLink>
      <ExternalLink
        href="https://novawallet.io"
      >
        <Image
          className="transition-transform will-change-transform hover:scale-105"
          width={32}
          height={32}
          src={NovaLogo}
          alt="Nova Wallet — The Leading Mobile Wallet for Polkadot"
        />
      </ExternalLink>
      <ExternalLink
        href="https://subwallet.app"
      >
        <Image
          className="transition-transform will-change-transform hover:scale-105"
          width={32}
          height={32}
          src={SubwalletLogo}
          alt="SubWallet - Highly secure and comprehensive Web3 wallet"
        />
      </ExternalLink>
      <ExternalLink
        href="https://talisman.xyz"
      >
        <Image
          className="transition-transform will-change-transform hover:scale-105"
          width={32}
          height={32}
          src={TalismanLogo}
          alt="Talisman - An Ethereum and Polkadot wallet"
        />
      </ExternalLink>
      <ExternalLink
        href="https://www.ledger.com"
      >
        <Image
          className="transition-transform will-change-transform hover:scale-105 rounded-[4px]"
          width={31}
          height={31}
          src={LedgerLogo}
          alt="Ledger - The best hardware wallet for crypto"
        />
      </ExternalLink>
    </div>
  );
}
