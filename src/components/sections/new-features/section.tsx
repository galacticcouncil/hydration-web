"use client";

import RwaFeature from "./rwa-feature";
import SecurityFeature from "./security-feature";

export default function NewFeaturesSection() {
  return (
    <div className="bg-white">
      <SecurityFeature />
      <RwaFeature />
    </div>
  );
}
