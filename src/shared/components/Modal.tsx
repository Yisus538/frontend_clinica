import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  /** Controls visibility */
  isOpen: boolean;
  /** Called when the user dismisses the modal (close button or backdrop click) */
  onClose: () => void;
  /** Title shown in the header */
  title: string;
  /** Main body content */
  children: ReactNode;
  /** Optional footer. If omitted no footer is rendered */
  footer?: ReactNode;
  /** Max width tailwind class, e.g. "max-w-lg" */
  maxWidth?: string;
}

/**
 * Generic modal built with a React Portal.
 * Handles:
 *  - Focus trap / Escape key to close
 *  - Scroll lock on body while open
 *  - Backdrop click to close
 *  - Smooth fade+scale entrance animation
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-lg",
}: ModalProps) => {
  /* Lock body scroll while open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Close on Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-background/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative bg-surface-container-lowest w-full ${maxWidth} rounded-xl shadow-2xl border border-outline-variant flex flex-col overflow-hidden animate-fade-in-up`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
          <h3
            id="modal-title"
            className="font-h3 text-h3 text-on-surface"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-surface border-t border-outline-variant">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
