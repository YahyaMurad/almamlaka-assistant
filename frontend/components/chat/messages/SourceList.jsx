"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PdfViewerModal = dynamic(() => import("./PdfViewerModal"), {
  ssr: false,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function sourceUrl(source) {
  if (!source.document_id) return null;
  return `${API_URL}/documents/${source.document_id}/file`;
}

export default function SourceList({ sources }) {
  const [viewing, setViewing] = useState(null);

  if (!sources?.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-muted">
        المصادر من المملكة
      </span>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
        {sources.map((source, index) => {
          const url = sourceUrl(source);
          return (
            <button
              key={index}
              type="button"
              disabled={!url}
              onClick={() =>
                setViewing({ url, page: source.page, title: source.title })
              }
              className={`flex w-full min-w-0 flex-col items-start gap-1 rounded-md border border-border bg-surface px-3 py-2.5 text-right text-foreground ${
                url ? "hover:border-brand" : "cursor-default opacity-70"
              }`}
            >
              <span className="w-full truncate text-[11px] font-semibold text-brand">
                {source.section}
              </span>
              <span className="w-full truncate text-sm font-medium leading-6">
                {source.title}
              </span>
            </button>
          );
        })}
      </div>

      {viewing && (
        <PdfViewerModal
          url={viewing.url}
          page={viewing.page}
          title={viewing.title}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
