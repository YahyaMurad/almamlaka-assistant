import { formatDate } from "@/lib/format";

export default function DocumentList({
  documents,
  loading,
  error,
  deletingId,
  onDelete,
}) {
  if (loading) return <p className="text-sm text-muted">جارٍ التحميل...</p>;
  if (error) return <p className="text-sm text-brand">{error}</p>;
  if (!documents.length)
    return <p className="text-sm text-muted">لا توجد مستندات مُدرجة بعد.</p>;

  const handleDelete = (doc) => {
    if (
      window.confirm(`حذف "${doc.filename}"؟ سيتم حذف كل المقاطع المرتبطة به.`)
    ) {
      onDelete(doc.id);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-brand-tint text-brand">
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {doc.filename}
              </p>
              <p className="text-xs text-muted">{doc.chunk_count} مقطع</p>
            </div>
          </div>

          <div className="flex flex-none items-center gap-3">
            <span dir="ltr" className="text-xs text-muted">
              {formatDate(doc.created_at)}
            </span>
            <button
              onClick={() => handleDelete(doc)}
              disabled={deletingId === doc.id}
              aria-label={`حذف ${doc.filename}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-brand-tint hover:text-brand disabled:opacity-50"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
