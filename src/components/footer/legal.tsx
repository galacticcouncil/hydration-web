"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Paragraph from "../ui/typography/paragraph";
import Modal from "../ui/modal/modal";
import TermsOfService from "./terms-of-service";
import PrivacyPolicy from "./privacy-policy";

type LegalProps = {
  className?: string;
  dark?: boolean;
};

export default function Legal({ className, dark = false }: LegalProps) {
  const [tosOpen, setTosOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <div className={twMerge("flex gap-4", className)}>
        <button
          onClick={() => setPrivacyOpen(true)}
          className="relative min-h-11 font-medium cursor-pointer lg:min-h-0 lg:before:absolute lg:before:-inset-y-2.5 lg:before:inset-x-0"
        >
          <Paragraph
            size="small"
            className={twMerge(
              "text-purple-dim lg:text-purple",
              dark && "text-lavender/55 transition-colors hover:text-white lg:text-lavender/55"
            )}
          >
            Privacy Policy
          </Paragraph>
        </button>
        <button
          onClick={() => setTosOpen(true)}
          className="relative min-h-11 font-medium cursor-pointer lg:min-h-0 lg:before:absolute lg:before:-inset-y-2.5 lg:before:inset-x-0"
        >
          <Paragraph
            size="small"
            className={twMerge(
              "text-purple-dim lg:text-purple",
              dark && "text-lavender/55 transition-colors hover:text-white lg:text-lavender/55"
            )}
          >
            Terms of Service
          </Paragraph>
        </button>
      </div>

      <Modal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Privacy Policy"
      >
        <PrivacyPolicy />
      </Modal>

      <Modal
        isOpen={tosOpen}
        onClose={() => setTosOpen(false)}
        title="Terms of Service"
      >
        <TermsOfService />
      </Modal>
    </>
  );
}
