import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  children: ReactNode;
  onBackdropClick?: () => void;
  labelledBy?: string;
}

export function Modal({ open, children, onBackdropClick, labelledBy }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10020] flex items-center justify-center bg-slate-950/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onBackdropClick?.();
      }}
    >
      {children}
    </div>
  );
}
