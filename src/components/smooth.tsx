"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

function SmoothScrolling({ children }: { children: React.ReactNode }) {
  // Firefox can lose wheel scrolling when this older Lenis release cancels
  // the native wheel event before its animation frame advances. Keep Lenis
  // available for anchor navigation there, but let Firefox own wheel input.
  const isFirefox =
    typeof navigator !== "undefined" && /Firefox\//.test(navigator.userAgent);
  const lenisOptions = {
    lerp: 0.1,
    smoothWheel: !isFirefox,
    syncTouch: false,
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
export default SmoothScrolling;
