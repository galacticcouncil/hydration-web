import Badge from "./badge";
import Image from "next/image";
import PolkadotLogo from "./assets/polkadot.svg";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

type Props = {
  className?: string;
  dark?: boolean;
};

export default function SecuredByBadge({ className, dark = false }: Props) {
  return (
    <Badge
      className={twMerge(
        "bg-transparent px-0",
        dark && "text-white/50",
        className
      )}
    >
      Secured by
      <Link href="https://polkadot.network" target="_blank">
        <Image
          className={twMerge(
            "py-2.5",
            dark && "brightness-0 invert opacity-75"
          )}
          src={PolkadotLogo}
          alt="polkadot logo"
        />
      </Link>
    </Badge>
  );
}
