"use client";

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

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
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      const originalOverflow = document.body.style.overflow;
      const originalRootOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        // Restore body scroll when modal closes
        document.body.style.overflow = originalOverflow;
        document.documentElement.style.overflow = originalRootOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab") {
        const controls = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]',
        );
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      previousFocus?.focus({ preventScroll: true });
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
          <m.div
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-purple/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <m.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              className={twMerge(
                "bg-white rounded-xl max-w-2xl w-full max-h-[calc(100dvh-2rem)] sm:max-h-[90dvh] overflow-hidden flex flex-col shadow-lg",
                className
              )}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between gap-3 px-5 py-4 border-b border-lavender sm:px-8 sm:py-6">
                <h2 id={titleId} className="font-gazpacho text-2xl font-medium leading-tight text-purple sm:text-3xl">
                  {title}
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-purple hover:bg-beige transition-colors font-geist text-2xl leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              {/* Content */}
              <div
                className="min-h-0 overflow-y-auto overscroll-contain px-5 py-6 flex-1 sm:px-8 sm:py-8"
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
            </m.div>
          </m.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
