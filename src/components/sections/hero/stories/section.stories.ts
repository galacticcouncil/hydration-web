import type { Meta, StoryObj } from "@storybook/react";
import { capitalMetricDefinitions } from "@/lib/capital-metrics";
import HeroSection from "../section";

const sampleValues = [66_000_000, 3_000_000, 3_000_000, 12_700_000];
const retrievedAt = new Date().toISOString();

const meta = {
  title: "Hero",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
  },

  tags: ["autodocs"],
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialMetrics: capitalMetricDefinitions.map((definition, index) => ({
      ...definition,
      value: sampleValues[index],
      delta: null,
      retrievedAt,
      asOf: null,
      status: "fresh" as const,
    })),
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
