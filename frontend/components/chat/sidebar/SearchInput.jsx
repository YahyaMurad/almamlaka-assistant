export default function SearchInput({ value, onChange }) {
  return (
    <label className="flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-muted">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="بحث في المحادثات"
        className="min-w-0 flex-1 border-none bg-transparent text-sm text-foreground outline-none"
      />
    </label>
  );
}
