import type { Meta, StoryObj } from "@storybook/react";
import DevsAndSecurityItem from "../item";
import LockIcon from "../assets/lock.svg";
import CodeIcon from "../icons/code";

const meta = {
  title: "DevsAndSecurity/Item",
  component: DevsAndSecurityItem,
  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],
} satisfies Meta<typeof DevsAndSecurityItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Hydration security",
    description: "Find and report vulnerabilities, receive generous rewards.",
    href: "x",
    icon: CodeIcon,
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
