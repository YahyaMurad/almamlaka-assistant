import { formatCompactNumber, formatCost } from "@/lib/format";

const TYPE_LABELS = {
  chat: "المحادثة",
  embedding: "التضمين (البحث)",
  translation: "الترجمة",
};

export default function UsageByTypeTable({ usageByType }) {
  if (!usageByType.length) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-border bg-surface">
        <p className="text-sm text-muted">لا يوجد استخدام مسجّل بعد</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold text-foreground">
        الاستخدام حسب النوع
      </h2>
      <div className="mt-3 flex flex-col">
        {usageByType.map((row) => (
          <div
            key={row.event_type}
            className="flex items-center justify-between border-b border-border-subtle py-2.5 last:border-0"
          >
            <span className="text-sm text-foreground">
              {TYPE_LABELS[row.event_type] ?? row.event_type}
            </span>
            <div className="flex items-center gap-4" dir="ltr">
              <span className="text-sm tabular-nums text-foreground-secondary">
                {formatCompactNumber(row.total_tokens)} tokens
              </span>
              <span className="text-sm font-medium tabular-nums text-foreground">
                {formatCost(row.cost_usd)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
