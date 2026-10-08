import { Variants } from "framer-motion";

export function staggerChildren(delay = 0.25) {
  return {
    visible: {
      transition: {
        staggerChildren: delay,
      },
    },
    exit: {
      transition: {
        staggerChildren: delay,
      },
    },
  } satisfies Variants;
}

export function revealStagger(delay = 0.1, y = 20) {
  return {
    initial: {
      opacity: 0,
      y,
      scale: 0.992,
      filter: "blur(7px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.05,
        ease: [0.2, 0.65, 0.3, 0.9],
        staggerChildren: delay,
      },
    },
  } satisfies Variants;
}

export function delayChildren(delay = 0.25) {
  return {
    visible: {
      transition: {
        delayChildren: delay,
      },
    },
  } satisfies Variants;
}

export function fadeUp(y = 20) {
  return {
    initial: {
      opacity: 0,
      y,
    },
    visible: {
      opacity: 1,
      y: "0",
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
    exit: {
      opacity: 0,
      y: -y,
      transition: {
        duration: 0.5,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  } satisfies Variants;
}

export function fadeIn() {
  return {
    initial: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  } satisfies Variants;
}

export function scaleUpSpin() {
  return {
    initial: {
      opacity: 0,
      scale: 0.8,
      rotate: 360,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  } satisfies Variants;
}

export function scaleUp() {
  return {
    initial: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  } satisfies Variants;
}

export function none() {
  return {} satisfies Variants;
}

export function slideIn({ x = 0, y = 0 }) {
  return {
    initial: {
      opacity: 0,
      x,
      y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  } satisfies Variants;
}
