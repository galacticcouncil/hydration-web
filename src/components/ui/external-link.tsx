import Link from "next/link";
import type { ComponentProps } from "react";

type ExternalLinkProps = Omit<ComponentProps<typeof Link>, "target" | "rel">;

export default function ExternalLink(props: ExternalLinkProps) {
  return <Link {...props} target="_blank" rel="noopener noreferrer" />;
}
