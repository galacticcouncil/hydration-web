"use client";

import { useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import Heading from "../typography/heading";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  useLayoutEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        // Restore body scroll when modal closes
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop and Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-purple/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              className={twMerge(
                "bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-lg",
                className
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-lavender">
                <Heading size="medium" className="text-purple">
                  {title}
                </Heading>
                <button
                  onClick={onClose}
                  className="text-purple hover:text-purple-dim transition-colors font-geist text-2xl leading-none"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              {/* Content */}
              <div
                className="overflow-y-auto px-8 py-8 flex-1"
                onWheel={(e) => {
                  e.stopPropagation();
                  const element = e.currentTarget;
                  const { scrollTop, scrollHeight, clientHeight } = element;
                  const isAtTop = scrollTop === 0;
                  const isAtBottom =
                    scrollTop + clientHeight >= scrollHeight - 1;

                  if (
                    (isAtTop && e.deltaY < 0) ||
                    (isAtBottom && e.deltaY > 0)
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
