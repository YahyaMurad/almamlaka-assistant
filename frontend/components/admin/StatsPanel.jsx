"use client";

import { useAdminStats } from "@/hooks/useAdminStats";
import { formatCompactNumber, formatCost } from "@/lib/format";
import StatTile from "./stats/StatTile";
import DailyActivityChart from "./stats/DailyActivityChart";
import UsageByTypeTable from "./stats/UsageByTypeTable";

export default function StatsPanel() {
  const { stats, loading, error } = useAdminStats();

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto bg-canvas p-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">الإحصائيات</h1>
        <p className="mt-1 text-sm text-muted">
          نظرة عامة على استخدام المساعد وتكلفته.
        </p>
      </div>

      {loading && <p className="text-sm text-muted">جارٍ التحميل...</p>}
      {error && <p className="text-sm text-brand">{error}</p>}

      {stats && (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            <StatTile
              label="المحادثات"
              value={formatCompactNumber(stats.conversation_count)}
            />
            <StatTile
              label="الرسائل"
              value={formatCompactNumber(stats.message_count)}
            />
            <StatTile
              label="التوكنز"
              value={formatCompactNumber(stats.total_tokens)}
            />
            <StatTile
              label="التكلفة التقديرية"
              value={formatCost(stats.estimated_cost_usd)}
            />
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            <StatTile
              label="المستندات المُدرجة"
              value={formatCompactNumber(stats.document_count)}
            />
            <StatTile
              label="متوسط الرسائل لكل محادثة"
              value={stats.avg_messages_per_conversation.toFixed(1)}
            />
            <StatTile
              label="نسبة الإجابات المستندة للمصادر"
              value={`${Math.round(stats.rag_hit_rate * 100)}%`}
              hint="من إجابات المساعد المستندة إلى المستندات المرفوعة"
            />
          </div>

          <DailyActivityChart data={stats.daily_activity} />

          <UsageByTypeTable usageByType={stats.usage_by_type} />
        </>
      )}
    </main>
  );
}
