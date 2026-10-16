"use client";

import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";
import ChatPanel from "./ChatPanel";
import { useChat } from "@/hooks/useChat";

export default function ChatShell() {
  const chat = useChat();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header onToggleSidebar={chat.toggleSidebar} />

      <div className="flex min-h-0 flex-1">
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            chat.sidebarOpen ? "w-72 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <Sidebar
            query={chat.query}
            onQueryChange={chat.setQuery}
            groups={chat.groups}
            noResults={chat.noResults}
            onNewChat={chat.newChat}
            onSelectConversation={chat.selectConversation}
          />
        </div>

        <ChatPanel
          isEmpty={chat.isEmpty}
          messages={chat.messages}
          typing={chat.typing}
          draft={chat.draft}
          onDraftChange={chat.setDraft}
          onSend={chat.ask}
        />
      </div>
    </div>
  );
}
