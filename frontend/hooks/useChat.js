"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createConversation as createRemoteConversation,
  getConversation,
  listConversations,
  sendMessage,
} from "@/lib/chatApi";
import { getClientId } from "@/lib/clientId";

const GROUP_ORDER = ["اليوم", "أمس", "الأسبوع الماضي"];

function groupForDate(isoDate) {
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(new Date(isoDate))) / 86400000,
  );
  if (diffDays <= 0) return "اليوم";
  if (diffDays === 1) return "أمس";
  return "الأسبوع الماضي";
}

function toLocalMessage(m) {
  return { role: m.role, text: m.content, sources: m.sources ?? [] };
}

function createDraftConversation(title = "محادثة جديدة") {
  return {
    id: `c${Date.now()}`,
    backendId: null,
    group: "اليوم",
    title,
    messages: [],
  };
}

export function useChat() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [convs, setConvs] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const clientId = getClientId();
    if (!clientId) return;
    listConversations(clientId)
      .then((list) => {
        setConvs(
          list.map((c) => ({
            id: c.id,
            backendId: c.id,
            group: groupForDate(c.created_at),
            title: c.title ?? "محادثة بدون عنوان",
            messages: null, // lazy-loaded on selection
          })),
        );
      })
      .catch(() => {});
  }, []);

  const activeConversation = convs.find((c) => c.id === activeId) ?? null;

  const newChat = useCallback(() => {
    if (activeConversation && (activeConversation.messages ?? []).length === 0)
      return;
    const conversation = createDraftConversation();
    setConvs((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    setDraft("");
    setQuery("");
  }, [activeConversation]);

  const selectConversation = useCallback(
    async (id) => {
      setActiveId(id);
      const conv = convs.find((c) => c.id === id);
      if (!conv || conv.messages !== null) return;
      try {
        const detail = await getConversation(id);
        const messages = detail.messages.map(toLocalMessage);
        setConvs((prev) =>
          prev.map((c) => (c.id === id ? { ...c, messages } : c)),
        );
      } catch {
        setConvs((prev) =>
          prev.map((c) => (c.id === id ? { ...c, messages: [] } : c)),
        );
      }
    },
    [convs],
  );

  const ask = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      let id = activeId;
      let conversation = convs.find((c) => c.id === id);
      if (!conversation) {
        conversation = createDraftConversation();
        id = conversation.id;
      }

      setConvs((prev) => {
        let next = prev.find((c) => c.id === id)
          ? prev
          : [conversation, ...prev];
        next = next.map((c) =>
          c.id === id
            ? {
                ...c,
                title: (c.messages ?? []).length
                  ? c.title
                  : trimmed.slice(0, 40),
                messages: [
                  ...(c.messages ?? []),
                  { role: "user", text: trimmed },
                ],
              }
            : c,
        );
        const index = next.findIndex((c) => c.id === id);
        const [moved] = next.splice(index, 1);
        return [moved, ...next];
      });
      setActiveId(id);
      setDraft("");
      setTyping(true);

      let backendId = conversation.backendId;
      if (!backendId) {
        const created = await createRemoteConversation(
          trimmed.slice(0, 40),
          getClientId(),
        );
        backendId = created.id;
        setConvs((prev) =>
          prev.map((c) => (c.id === id ? { ...c, backendId } : c)),
        );
      }

      const updateLastAssistantMessage = (patch) => {
        setConvs((prev) =>
          prev.map((c) => {
            if (c.id !== id) return c;
            const messages = c.messages ?? [];
            const last = messages[messages.length - 1];
            if (last?.role === "assistant") {
              const next = [...messages];
              next[next.length - 1] = { ...last, ...patch(last) };
              return { ...c, messages: next };
            }
            return {
              ...c,
              messages: [
                ...messages,
                { role: "assistant", text: "", sources: [], ...patch(null) },
              ],
            };
          }),
        );
      };

      await sendMessage(
        backendId,
        trimmed,
        (delta) => {
          setTyping(false);
          updateLastAssistantMessage((last) => ({
            text: (last?.text ?? "") + delta,
          }));
        },
        (sources) => updateLastAssistantMessage(() => ({ sources })),
      );
      setTyping(false);
    },
    [activeId, convs, typing],
  );

  const groups = useMemo(() => {
    const trimmedQuery = query.trim();
    const filtered = convs.filter(
      (c) => !trimmedQuery || c.title.includes(trimmedQuery),
    );
    return GROUP_ORDER.map((label) => ({
      label,
      items: filtered
        .filter((c) => c.group === label)
        .map((c) => ({ id: c.id, title: c.title, active: c.id === activeId })),
    })).filter((g) => g.items.length > 0);
  }, [convs, query, activeId]);

  const messages = activeConversation?.messages ?? [];
  const isEmpty = messages.length === 0 && !typing;
  const noResults = convs.length > 0 && groups.length === 0;

  return {
    sidebarOpen,
    toggleSidebar: () => setSidebarOpen((v) => !v),
    query,
    setQuery,
    draft,
    setDraft,
    typing,
    groups,
    noResults,
    messages,
    isEmpty,
    newChat,
    ask,
    selectConversation,
  };
}
