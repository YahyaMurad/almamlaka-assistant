const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getStats() {
  const res = await fetch(`${API_URL}/stats`);
  if (!res.ok) throw new Error("Failed to load statistics");
  return res.json();
}
