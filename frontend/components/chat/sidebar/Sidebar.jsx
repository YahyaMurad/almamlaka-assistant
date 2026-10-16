import NewChatButton from "./NewChatButton";
import SearchInput from "./SearchInput";
import ConversationList from "./ConversationList";
import UserFooter from "./UserFooter";

export default function Sidebar({ query, onQueryChange, groups, noResults, onNewChat, onSelectConversation }) {
  return (
    <aside className="flex h-full min-h-0 w-72 flex-none flex-col border-l-2 border-border-strong bg-panel shadow-[4px_0_16px_rgba(0,0,0,0.10)]">
      <div className="flex flex-col gap-2.5 p-3.5 pb-2.5">
        <NewChatButton onClick={onNewChat} />
        {/* <SearchInput value={query} onChange={onQueryChange} /> */}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-4">
        <ConversationList groups={groups} noResults={noResults} onSelect={onSelectConversation} />
      </div>
      <UserFooter />
    </aside>
  );
}
