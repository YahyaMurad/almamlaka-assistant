export default function ConversationItem({ title, active, onClick }) {
  if (active) {
    return (
      <button
        onClick={onClick}
        className="flex w-full items-center gap-2.5 rounded-md bg-surface px-2.5 py-2.5 text-right text-sm font-semibold text-foreground shadow-sm"
      >
        <span className="h-4.5 w-0.75 flex-none rounded-sm bg-brand" />
        <span className="min-w-0 flex-1 truncate">{title}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-right text-sm text-foreground-secondary hover:bg-foreground/5"
    >
      <span className="h-4.5 w-0.75 flex-none" />
      <span className="min-w-0 flex-1 truncate">{title}</span>
    </button>
  );
}
