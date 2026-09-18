import { fadeUp, staggerChildren } from "@/animation/variants";
import { m } from "framer-motion";
import React, { Fragment, ReactNode } from "react";

type LetterByLetterProps = {
  children: ReactNode;
  staggerDelay?: number;
};

export default function LetterByLetter({
  children,
  staggerDelay = 0.05,
}: LetterByLetterProps) {
  // Function to handle recursive children parsing
  const parseChildren = (element: ReactNode) => {
    if (typeof element === "string") {
      // Split the text into words and handle them individually
      return element.split(/\s+/).map((word, index) => (
        <Fragment key={index}>
          <span style={{ display: "inline-flex", overflow: "hidden" }}>
            {" "}
            {/* Ensure each word is treated as an inline-flex container */}
            {word.split("").map((letter, letterIndex) => (
              <m.span
                className="inline-block"
                key={letterIndex}
                variants={fadeUp()}
              >
                {letter}
              </m.span>
            ))}
          </span>{" "}
          {/* Add normal space for natural text flow */}
        </Fragment>
      ));
    } else if (Array.isArray(element)) {
      return element.map((child, index) => (
        <Fragment key={index}>{parseChildren(child)}</Fragment>
      ));
    } else {
      return element;
    }
  };

  return (
    <span className="block" data-animated-heading>
      <span className="sr-only">{children}</span>
      <m.span className="block" aria-hidden="true" variants={staggerChildren(staggerDelay)}>
        {React.Children.map(children, (child) => (
          <Fragment>{parseChildren(child)}</Fragment>
        ))}
      </m.span>
    </span>
  );
}
