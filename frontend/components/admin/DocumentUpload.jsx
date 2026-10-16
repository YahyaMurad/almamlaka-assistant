"use client";

import { useRef } from "react";

export default function DocumentUpload({ uploading, error, onUpload }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onUpload(file);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border-strong bg-surface p-6">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex h-11 w-fit items-center justify-center gap-2 rounded-md bg-brand px-4 text-[15px] font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 16V4M12 4l-4 4M12 4l4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        {uploading ? "جارٍ الرفع..." : "اختيار ملف PDF"}
      </button>
      {error && <p className="text-sm text-brand">{error}</p>}
    </div>
  );
}
