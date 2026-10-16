import ConversationGroup from "./ConversationGroup";

export default function ConversationList({ groups, noResults, onSelect }) {
  if (noResults) {
    return <div className="py-6 text-center text-[13px] text-muted">لا توجد نتائج</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      {groups.map((group) => (
        <ConversationGroup key={group.label} label={group.label} items={group.items} onSelect={onSelect} />
      ))}
    </div>
  );
}
