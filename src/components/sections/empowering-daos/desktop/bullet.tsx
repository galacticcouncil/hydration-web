import { twMerge } from "tailwind-merge";
import { m } from "framer-motion";
import { fadeUp } from "@/animation/variants";

type BulletProps = {
  active: boolean;
};

export default function Bullet({ active }: BulletProps) {
  return (
    <m.div
      initial={{
        opacity: 0,
        x: -20,
      }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          duration: 1,
          ease: [0.2, 0.65, 0.3, 0.9],
        },
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      className={twMerge(
        "flex rounded-full w-3 h-3 min-w-3 min-h-3 bg-pink"
        //   active ? "bg-pink" : "bg-[#816093]"
      )}
    />
  );
}
