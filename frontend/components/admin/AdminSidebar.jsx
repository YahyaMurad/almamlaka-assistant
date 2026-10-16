const TABS = [
  { id: "documents", label: "المستندات" },
  { id: "stats", label: "الإحصائيات" },
];

export default function AdminSidebar({ activeTab, onSelectTab }) {
  return (
    <aside className="flex h-full min-h-0 w-72 flex-none flex-col border-l-2 border-border-strong bg-panel shadow-[4px_0_16px_rgba(0,0,0,0.10)]">
      <div className="flex flex-col gap-1 p-3.5">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={
                active
                  ? "flex items-center gap-2.5 rounded-md bg-surface px-2.5 py-2.5 text-right text-sm font-semibold text-foreground shadow-sm"
                  : "flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-right text-sm text-foreground-secondary hover:bg-foreground/5"
              }
            >
              <span
                className={`h-4.5 w-0.75 flex-none rounded-sm ${active ? "bg-brand" : ""}`}
              />
              <span className="min-w-0 flex-1 truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
