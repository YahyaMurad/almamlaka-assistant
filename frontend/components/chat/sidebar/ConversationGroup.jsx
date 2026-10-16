import ConversationItem from "./ConversationItem";

export default function ConversationGroup({ label, items, onSelect }) {
  return (
    <div>
      <div className="px-2 py-3.5 pb-1.5 text-xs font-semibold text-muted">{label}</div>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <ConversationItem
            key={item.id}
            title={item.title}
            active={item.active}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
