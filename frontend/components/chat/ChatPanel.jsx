"use client";

import { useEffect, useRef } from "react";
import EmptyState from "./empty-state/EmptyState";
import MessageList from "./messages/MessageList";
import Composer from "./composer/Composer";

export default function ChatPanel({
  isEmpty,
  messages,
  typing,
  draft,
  onDraftChange,
  onSend,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages, typing]);

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-canvas">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-6.5 px-6 pb-6 pt-7">
          {isEmpty && <EmptyState onSelectSuggestion={onSend} />}
          <MessageList messages={messages} typing={typing} />
        </div>
      </div>

      <Composer
        draft={draft}
        onDraftChange={onDraftChange}
        onSend={() => onSend(draft)}
      />
    </main>
  );
}
