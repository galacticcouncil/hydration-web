import type { Meta, StoryObj } from "@storybook/react";
import LiquidityIncentivesArches from "../arches";

const meta = {
  title: "LiquidityIncentives/Arches",
  component: LiquidityIncentivesArches,
  parameters: {
    layout: "fullscreen",
  },

  tags: ["autodocs"],
} satisfies Meta<typeof LiquidityIncentivesArches>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
