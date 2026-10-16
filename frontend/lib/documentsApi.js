const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function listDocuments() {
  const res = await fetch(`${API_URL}/documents`);
  if (!res.ok) throw new Error("Failed to load documents");
  return res.json();
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/documents`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? "Failed to upload document");
  }
  return res.json();
}

export async function deleteDocument(documentId) {
  const res = await fetch(`${API_URL}/documents/${documentId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? "Failed to delete document");
  }
}
