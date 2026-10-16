export default function SourceList({ sources }) {
  if (!sources?.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-muted">المصادر من المملكة</span>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
        {sources.map((source, index) => (
          <a
            key={index}
            href="#"
            className="flex flex-col gap-1 rounded-md border border-border bg-surface px-3 py-2.5 text-foreground no-underline hover:border-brand"
          >
            <span className="text-[11px] font-semibold text-brand">{source.section}</span>
            <span className="text-sm font-medium leading-6">{source.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
