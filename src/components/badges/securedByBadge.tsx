import Badge from "./badge";
import Image from "next/image";
import PolkadotLogo from "./assets/polkadot.svg";
import { twMerge } from "tailwind-merge";
import ExternalLink from "@/components/ui/external-link";

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
      <ExternalLink href="https://polkadot.network">
        <Image
          className={twMerge(
            "py-2.5",
            dark && "brightness-0 invert opacity-75"
          )}
          src={PolkadotLogo}
          alt="polkadot logo"
        />
      </ExternalLink>
    </Badge>
  );
}
