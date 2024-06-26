"use client";

import useResize from "@/hooks/useResize";
import useScroll from "@/hooks/useScroll";
import React, { useState, useRef, useMemo } from "react";
import {
  InPortal,
  OutPortal,
  createHtmlPortalNode,
} from "react-reverse-portal";

type ScrollLockProps = {
  durationPx: number;
  render: (progress: number) => React.ReactNode;
};

export default function ScrollLock({ durationPx, render }: ScrollLockProps) {
  const [scrollY, setScrollY] = useState(0);
  const placeholderRef = useRef<HTMLDivElement>(null);

  const [top, setTop] = useState(0);

  const portalNode = useMemo(() => createHtmlPortalNode(), []);

  useResize(({ height }) => {
    if (placeholderRef.current) {
      setTop(placeholderRef.current.offsetTop - height);
    }
  });

  useScroll(({ scrollY }) => {
    setScrollY(scrollY);
  });

  const progress = useMemo(() => {
    const start = top;
    const end = start + durationPx;
    return scrollY < start
      ? 0
      : scrollY > end
        ? 100
        : ((scrollY - start) / durationPx) * 100;
  }, [scrollY, durationPx, top]);

  return (
    <>
      <InPortal node={portalNode}>{render(progress)}</InPortal>
      <div className="z-[15] h-screen bg-purple">
        {progress === 0 && <OutPortal node={portalNode} />}
      </div>
      {progress > 0 && progress < 100 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: 25,
          }}
        >
          <OutPortal node={portalNode} />
        </div>
      )}
      <div
        className="bg-purple"
        ref={placeholderRef}
        style={{ height: `calc(${durationPx}px  - 100vh)` }}
      />
      <div className="z-[15] h-screen bg-purple">
        {progress === 100 && <OutPortal node={portalNode} />}
      </div>
    </>
  );
}
