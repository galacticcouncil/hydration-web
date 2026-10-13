import { MotionGlobalConfig } from "framer-motion";
import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// Every Framer animation (reveals, hovers, delayed intros) jumps straight to
// its final keyframe while the user prefers reduced motion.
if (typeof window !== "undefined") {
  const sync = () => {
    MotionGlobalConfig.skipAnimations = window.matchMedia(query).matches;
  };
  sync();
  subscribe(sync);
}

// Unlike Framer's useReducedMotion, this matches the server render (false)
// during hydration and updates afterwards, so React patches every prop that
// depends on it. It also follows live changes of the OS setting.
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
