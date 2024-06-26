"use client";

import AnimateOnView from "@/animation/motion-section";
import Galaxy from "./galaxy";

export default function BringYourOwnGasSection() {
  return (
    <AnimateOnView className="bg-white-100">
      <div className="container mx-auto  ~pt-[2rem]/[4.125rem] pb-1.5">
        <Galaxy />
      </div>
    </AnimateOnView>
  );
}
