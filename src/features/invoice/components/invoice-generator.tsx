"use client";

import { flushSync } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccessPortal } from "@/features/security/access-portal";
import { useAutoLock } from "../hooks/use-auto-lock";
import { useInvoiceGenerator } from "../hooks/use-invoice-generator";
import { useTemplateAccent } from "../hooks/use-template-accent";
import { useTemplateBusinessProfile } from "../hooks/use-template-business-profile";
import { useTemplateSelection } from "../hooks/use-template-selection";
import { buildExportBaseName, buildReceiptExportBaseName, exportInvoiceDocument, exportRenderedDocumentPng } from "../lib/export-adapter";
import { parseStrictDisplayedDate } from "../lib/date";
import { buildInvoicePresentation } from "../presentation/invoice-presentation";
import { SapphireInvoiceRenderer } from "../renderers/sapphire-invoice-renderer";
import { ClassicLedgerRenderer } from "../templates/classic-ledger/classic-ledger-renderer";
import { CLASSIC_LEDGER_INVOICE_STORAGE_SCOPE } from "../templates/classic-ledger/storage";
import { ClassicReceiptRenderer } from "../templates/classic-receipt/classic-receipt-renderer";
import { buildClassicReceiptPresentation } from "../templates/classic-receipt/lib/receipt-presentation";
import { useClassicReceipt } from "../templates/classic-receipt/use-classic-receipt";
import { INVOICE_TEMPLATES } from "../templates/registry";
import { TemplateGallery } from "../template-gallery/template-gallery";
import type { ExportFormat } from "../types";
import { ExportStatus } from "./export-status";
import { InvoiceToolbar } from "./invoice-toolbar";
import { NewInvoiceModal } from "./new-invoice-modal";

export function InvoiceGenerator() {
  const octalveInvoice = useInvoiceGenerator();
  const ledgerInvoice = useInvoiceGenerator(CLASSIC_LEDGER_INVOICE_STORAGE_SCOPE);
  const receipt = useClassicReceipt();
  const ledgerBusiness = useTemplateBusinessProfile("classic-ledger");
  const receiptBusiness = useTemplateBusinessProfile("classic-receipt");
  const templates = useTemplateSelection();
  const activeTemplate = INVOICE_TEMPLATES[templates.templateId];
  const accent = useTemplateAccent(templates.templateId, activeTemplate.customizableAccent);
  const activeInvoice = templates.templateId === "classic-ledger" ? ledgerInvoice : octalveInvoice;
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [lockMessage, setLockMessage] = useState("");
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [workspaceView, setWorkspaceView] = useState<"templates" | "editor">("templates");

  const autoLock = useCallback(() => {
    setUnlocked(false);
    setLockMessage("AUTO-LOCKED DUE TO INACTIVITY. ENTER CODE TO CONTINUE.");
    setNewInvoiceOpen(false);
    setWorkspaceView("templates");
  }, []);

  const { resetInactivityTimer, clearInactivityTimer } = useAutoLock(unlocked, autoLock);

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setNewInvoiceOpen(false);
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  function unlock() {
    setLockMessage("");
    setWorkspaceView("templates");
    setUnlocked(true);
  }

  function lock() {
    setLockMessage("");
    setUnlocked(false);
    setNewInvoiceOpen(false);
    setWorkspaceView("templates");
    clearInactivityTimer();
  }

  async function handleExport(format: ExportFormat) {
    if (!templates.initialized || exporting || !invoiceRef.current) return;

    const selectedTemplate = INVOICE_TEMPLATES[templates.templateId];
    if (format === "pdf" && !selectedTemplate.pdfAvailable) {
      window.alert("Native PDF is not available for the selected template.");
      return;
    }

    if (templates.templateId === "classic-receipt") {
      if (!receipt.initialized || !receiptBusiness.initialized) return;
      const validDate = parseStrictDisplayedDate(receipt.draft.day, receipt.draft.month, receipt.draft.year);
      if (!validDate) {
        window.alert("Please enter a valid receipt date before exporting.");
        return;
      }

      setExporting(format);
      clearInactivityTimer();
      try {
        const presentation = buildClassicReceiptPresentation(receipt.draft, receiptBusiness.profile);
        const filenameBase = buildReceiptExportBaseName(
          presentation.receiptNo,
          presentation.receivedFrom,
          presentation.currency,
        );

        if (format === "pdf") {
          const { exportClassicReceiptPdf } = await import("../templates/classic-receipt/pdf/classic-receipt-pdf-export");
          await exportClassicReceiptPdf(presentation, `${filenameBase}.pdf`, accent.accentColor);
        } else {
          await exportRenderedDocumentPng(invoiceRef.current, filenameBase, {
            paperSize: presentation.paperSize,
            currency: presentation.currency,
            orientation: "landscape",
          });
        }
      } catch (error) {
        console.error("Receipt export failed", error);
        window.alert("The receipt could not be generated. Please reload the page and try again.");
      } finally {
        setExporting(null);
        resetInactivityTimer();
      }
      return;
    }

    if (!activeInvoice.initialized) return;
    if (templates.templateId === "classic-ledger" && !ledgerBusiness.initialized) return;

    const validIssueDate = parseStrictDisplayedDate(activeInvoice.draft.day, activeInvoice.draft.month, activeInvoice.draft.year);
    const validDueDate = parseStrictDisplayedDate(activeInvoice.draft.dueDay, activeInvoice.draft.dueMonth, activeInvoice.draft.dueYear);

    if (!validIssueDate || !validDueDate) {
      window.alert("Please enter valid issue and due dates before exporting.");
      return;
    }

    setExporting(format);
    clearInactivityTimer();

    try {
      let committedNumber = activeInvoice.draft.invoiceNo;
      flushSync(() => {
        committedNumber = activeInvoice.commitInvoiceNumberIfNeeded();
      });

      const filenameBase = buildExportBaseName(
        committedNumber,
        activeInvoice.draft.clientName,
        activeInvoice.draft.currency,
      );

      const presentation = buildInvoicePresentation({
        draft: activeInvoice.draft,
        paymentSettings: activeInvoice.paymentSettings,
        totals: activeInvoice.totals,
        invoiceNo: committedNumber,
        companyProfile: templates.templateId === "classic-ledger" ? ledgerBusiness.profile : undefined,
      });

      await exportInvoiceDocument({
        element: invoiceRef.current,
        format,
        filenameBase,
        presentation,
        templateId: templates.templateId,
        accentColor: accent.accentColor,
      });
    } catch (error) {
      console.error("Invoice export failed", error);
      window.alert("The invoice could not be generated. Please reload the page and try again.");
    } finally {
      setExporting(null);
      resetInactivityTimer();
    }
  }

  if (!unlocked) return <AccessPortal onUnlock={unlock} message={lockMessage} />;

  if (workspaceView === "templates") {
    return (
      <TemplateGallery
        activeTemplateId={templates.templateId}
        onUseTemplate={(templateId) => {
          templates.changeTemplate(templateId);
          setWorkspaceView("editor");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onLock={lock}
      />
    );
  }

  const currency = templates.templateId === "classic-receipt" ? receipt.draft.currency : activeInvoice.draft.currency;
  const paperSize = templates.templateId === "classic-receipt" ? receipt.draft.paperSize : activeInvoice.draft.paperSize;

  return (
    <main className="min-h-screen bg-slate-100 py-4 md:py-10">
      <InvoiceToolbar
        currency={currency}
        paperSize={paperSize}
        paperOptions={templates.templateId === "classic-receipt" ? ["A5"] : undefined}
        templateId={templates.templateId}
        documentKind={activeTemplate.documentKind}
        extraDetailsVisible={templates.templateId === "classic-receipt" ? false : activeInvoice.draft.extraDetailsVisible}
        exporting={Boolean(exporting)}
        accentColor={accent.accentColor}
        customizableAccent={activeTemplate.customizableAccent}
        onAddRow={activeInvoice.addRow}
        onRemoveRow={activeInvoice.removeRow}
        onNewInvoice={() => {
          if (templates.templateId === "classic-receipt") {
            if (window.confirm("Start a new receipt? The current receipt draft will be replaced.")) receipt.newReceipt();
          } else {
            setNewInvoiceOpen(true);
          }
        }}
        onToggleExtraDetails={activeInvoice.toggleExtraDetails}
        onCurrencyChange={(nextCurrency) => templates.templateId === "classic-receipt" ? receipt.changeCurrency(nextCurrency) : activeInvoice.changeCurrency(nextCurrency)}
        onPaperSizeChange={(nextPaper) => templates.templateId === "classic-receipt" ? receipt.changePaperSize(nextPaper) : activeInvoice.changePaperSize(nextPaper)}
        onOpenTemplates={() => setWorkspaceView("templates")}
        onAccentChange={accent.changeAccent}
        onAccentReset={accent.resetAccent}
        onLock={lock}
        onExportPdf={() => void handleExport("pdf")}
        onExportPng={() => void handleExport("png")}
        pdfAvailable={activeTemplate.pdfAvailable}
      />

      <section className="overflow-x-auto px-4 pb-8">
        {templates.templateId === "classic-receipt" ? (
          <ClassicReceiptRenderer
            containerRef={invoiceRef}
            accentColor={accent.accentColor}
            draft={receipt.draft}
            businessProfile={receiptBusiness.profile}
            onBusinessProfileChange={receiptBusiness.update}
            onChange={receipt.update}
            onDateChange={receipt.updateDate}
            onReceiptSequenceChange={receipt.updateReceiptSequence}
            onPaymentMethodChange={receipt.changePaymentMethod}
            onAmountBlur={receipt.normalizeAmountField}
          />
        ) : templates.templateId === "classic-ledger" ? (
          <ClassicLedgerRenderer
            containerRef={invoiceRef}
            accentColor={accent.accentColor}
            draft={ledgerInvoice.draft}
            businessProfile={ledgerBusiness.profile}
            paymentSettings={ledgerInvoice.paymentSettings}
            totals={ledgerInvoice.totals}
            onBusinessProfileChange={ledgerBusiness.update}
            onDraftChange={ledgerInvoice.updateDraft}
            onDateChange={ledgerInvoice.updateDateField}
            onDueDateChange={ledgerInvoice.updateDueDateField}
            onInvoiceSequenceChange={ledgerInvoice.updateInvoiceSequence}
            onLineChange={ledgerInvoice.updateLine}
            onLineUnitPriceBlur={ledgerInvoice.formatLineUnitPrice}
            onLineQuantityBlur={ledgerInvoice.normalizeLineQuantity}
            onLineDiscountBlur={ledgerInvoice.normalizeLineDiscount}
            onPercentageBlur={ledgerInvoice.normalizePercentage}
            onPaymentSettingChange={ledgerInvoice.updatePaymentSetting}
          />
        ) : (
          <SapphireInvoiceRenderer
            containerRef={invoiceRef}
            draft={octalveInvoice.draft}
            paymentSettings={octalveInvoice.paymentSettings}
            totals={octalveInvoice.totals}
            onDraftChange={octalveInvoice.updateDraft}
            onDateChange={octalveInvoice.updateDateField}
            onDueDateChange={octalveInvoice.updateDueDateField}
            onInvoiceSequenceChange={octalveInvoice.updateInvoiceSequence}
            onLineChange={octalveInvoice.updateLine}
            onLineUnitPriceBlur={octalveInvoice.formatLineUnitPrice}
            onLineQuantityBlur={octalveInvoice.normalizeLineQuantity}
            onLineDiscountBlur={octalveInvoice.normalizeLineDiscount}
            onPercentageBlur={octalveInvoice.normalizePercentage}
            onPaymentSettingChange={octalveInvoice.updatePaymentSetting}
          />
        )}
      </section>

      <NewInvoiceModal
        open={newInvoiceOpen}
        onCancel={() => setNewInvoiceOpen(false)}
        onConfirm={() => {
          activeInvoice.startNewInvoice();
          setNewInvoiceOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <ExportStatus format={exporting} />
    </main>
  );
}
