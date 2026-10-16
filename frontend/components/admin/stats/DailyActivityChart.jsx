"use client";

import { useState } from "react";

function formatDay(isoDate) {
  return new Date(isoDate).toLocaleDateString("ar", {
    day: "numeric",
    month: "short",
  });
}

export default function DailyActivityChart({ data }) {
  const [hovered, setHovered] = useState(null);

  if (!data.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-surface">
        <p className="text-sm text-muted">لا يوجد نشاط خلال آخر 14 يوماً</p>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.message_count), 1);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          الرسائل اليومية (آخر 14 يوماً)
        </h2>
        <span className="text-xs text-muted">الحد الأقصى: {max}</span>
      </div>

      <div
        className="relative mt-4 flex h-36 items-end gap-0.5 border-b border-border"
        dir="ltr"
      >
        {data.map((d, i) => {
          const heightPct = (d.message_count / max) * 100;
          const isHovered = hovered === i;
          return (
            <div
              key={d.date}
              className="relative flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            >
              {isHovered && (
                <div className="absolute bottom-full mb-1.5 flex flex-col items-center gap-0.5 whitespace-nowrap rounded-md border border-border bg-panel px-2 py-1 text-xs shadow-sm">
                  <span className="font-semibold text-foreground">
                    {d.message_count} رسالة
                  </span>
                  <span className="text-muted">{formatDay(d.date)}</span>
                </div>
              )}
              <div
                role="img"
                tabIndex={0}
                aria-label={`${formatDay(d.date)}: ${d.message_count} رسالة`}
                className={`w-full max-w-6 rounded-t transition-colors ${
                  isHovered ? "bg-brand-hover" : "bg-brand"
                }`}
                style={{
                  height: `${Math.max(heightPct, d.message_count > 0 ? 4 : 0)}%`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
