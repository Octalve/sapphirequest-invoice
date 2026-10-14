"use client";

import { FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface NewInvoiceModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function NewInvoiceModal({ open, onCancel, onConfirm }: NewInvoiceModalProps) {
  return (
    <Modal open={open} onBackdropClick={onCancel} labelledBy="new-invoice-title">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="sq-brand-blue sq-pill-center h-12 w-12 shrink-0 rounded-full">
            <FilePlus2 className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 id="new-invoice-title" className="text-xl font-black text-slate-900">
              Start a New Invoice?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              The current client, services, amounts and notes will be cleared. Your saved payment details and selected currency will remain available.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onCancel}>Cancel</Button>
          <Button tone="primary" onClick={onConfirm}>
            Start New Invoice
          </Button>
        </div>
      </div>
    </Modal>
  );
}
