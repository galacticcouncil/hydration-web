import type { Preview } from "@storybook/react";
import "../src/app/globals.css";
import React from "react";
import MotionProvider from "../src/animation/motion-provider";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        {
          name: "dark",
          value: "#1a202c",
        },
        {
          name: "light",
          value: "#f7fafc",
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        desktop: {
          name: "Desktop",
          styles: {
            width: "1440px",
            height: "1024px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "812px",
          },
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <MotionProvider>
        <main className={"w-full"}>
          <Story />
        </main>
      </MotionProvider>
    ),
  ],
};

export default preview;
