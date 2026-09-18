"use client";

import Image from "next/image";
import Badge from "./badge";
import Link from "next/link";

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
      <Link
        href="https://metamask.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          className="transition-transform hover:scale-105"
          width={32}
          height={32}
          src={MetaMaskLogo}
          alt="MetaMask - The Ultimate Crypto Wallet for DeFi, Web3 Apps, and NFTs"
        />
      </Link>
      <Link
        href="https://novawallet.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          className="transition-transform hover:scale-105"
          width={32}
          height={32}
          src={NovaLogo}
          alt="Nova Wallet — The Leading Mobile Wallet for Polkadot"
        />
      </Link>
      <Link
        href="https://subwallet.app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          className="transition-transform hover:scale-105"
          width={32}
          height={32}
          src={SubwalletLogo}
          alt="SubWallet - Highly secure and comprehensive Web3 wallet"
        />
      </Link>
      <Link
        href="https://talisman.xyz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          className="transition-transform hover:scale-105"
          width={32}
          height={32}
          src={TalismanLogo}
          alt="Talisman - An Ethereum and Polkadot wallet"
        />
      </Link>
      <Link
        href="https://www.ledger.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          className="transition-transform hover:scale-105 rounded-[4px]"
          width={31}
          height={31}
          src={LedgerLogo}
          alt="Ledger - The best hardware wallet for crypto"
        />
      </Link>
    </div>
  );
}
