export default function StatTile({ label, value, hint }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-5">
      <span className="text-sm text-foreground-secondary">{label}</span>
      <span className="text-[28px] font-semibold leading-none text-foreground">
        {value}
      </span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}
