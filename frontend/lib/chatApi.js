const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function createConversation(title, clientId) {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, client_id: clientId }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

export async function listConversations(clientId) {
  const res = await fetch(
    `${API_URL}/conversations?client_id=${encodeURIComponent(clientId)}`,
  );
  if (!res.ok) throw new Error("Failed to load conversations");
  return res.json();
}

export async function getConversation(conversationId) {
  const res = await fetch(`${API_URL}/conversations/${conversationId}`);
  if (!res.ok) throw new Error("Failed to load conversation");
  return res.json();
}

export async function sendMessage(conversationId, text, onDelta, onDone) {
  const res = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    },
  );
  if (!res.ok || !res.body) throw new Error("Failed to send message");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop();

    for (const event of events) {
      const line = event.trim();
      if (!line.startsWith("data: ")) continue;
      const data = JSON.parse(line.slice(6));
      if (data.delta) onDelta(data.delta);
      if (data.done) onDone?.(data.sources ?? []);
    }
  }
}
