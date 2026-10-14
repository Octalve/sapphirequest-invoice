"use client";

import { LoaderCircle } from "lucide-react";
import type { ExportFormat } from "../types";

export function ExportStatus({ format }: { format: ExportFormat | null }) {
  if (!format) return null;

  return (
    <div className="fixed inset-0 z-[10030] flex items-center justify-center bg-slate-950/45 p-4" role="status" aria-live="polite">
      <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-2xl">
        <LoaderCircle className="sq-text-brand-blue h-7 w-7 animate-spin" aria-hidden="true" />
        <div>
          <p className="font-black text-slate-900">Generating {format === "pdf" ? "PDF" : "PNG"}...</p>
          <p className="mt-1 text-xs text-slate-500">Please keep this page open until the download starts.</p>
        </div>
      </div>
    </div>
  );
}
