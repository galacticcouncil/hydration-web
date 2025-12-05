"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Paragraph from "../ui/typography/paragraph";
import Modal from "../ui/modal/modal";
import TermsOfService from "./terms-of-service";
import PrivacyPolicy from "./privacy-policy";

type LegalProps = {
  className?: string;
};

export default function Legal({ className }: LegalProps) {
  const [tosOpen, setTosOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <div className={twMerge("flex gap-4", className)}>
        <button
          onClick={() => setPrivacyOpen(true)}
          className="font-inter font-medium cursor-pointer"
        >
          <Paragraph size="small" className="text-purple-dim lg:text-purple">
            Privacy Policy
          </Paragraph>
        </button>
        <button
          onClick={() => setTosOpen(true)}
          className="font-inter font-medium cursor-pointer"
        >
          <Paragraph size="small" className="text-purple-dim lg:text-purple">
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

