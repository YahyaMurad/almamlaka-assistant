"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PdfViewerModal({ url, page, title, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [error, setError] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-none items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="min-w-0 truncate text-sm font-semibold text-foreground">
            {title}
          </p>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-md text-muted hover:bg-foreground/5 hover:text-foreground"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto bg-canvas p-4">
          {error ? (
            <p className="py-10 text-sm text-brand">تعذر تحميل الملف</p>
          ) : (
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => setError(true)}
              loading={
                <p className="py-10 text-sm text-muted">جارٍ التحميل...</p>
              }
            >
              <Page pageNumber={currentPage} width={640} />
            </Document>
          )}
        </div>

        {numPages > 1 && (
          <div
            dir="ltr"
            className="flex flex-none items-center justify-center gap-4 border-t border-border px-4 py-2.5"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              aria-label="الصفحة السابقة"
              className="flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-foreground/5 disabled:opacity-30"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="text-sm tabular-nums text-foreground-secondary">
              {currentPage} / {numPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages}
              aria-label="الصفحة التالية"
              className="flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-foreground/5 disabled:opacity-30"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
