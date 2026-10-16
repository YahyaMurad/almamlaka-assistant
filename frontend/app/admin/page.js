"use client";

import { useEffect, useState } from "react";
import { verifyPassword } from "@/lib/adminAuth";
import AdminShell from "@/components/admin/AdminShell";

const SESSION_KEY = "admin-authed";

export default function AdminPage() {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setAuthed(sessionStorage.getItem(SESSION_KEY) === "true");
    } catch {}
    setChecked(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const ok = await verifyPassword(password);
    if (!ok) {
      setError("كلمة المرور غير صحيحة");
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {}
    setAuthed(true);
  };

  if (!checked) return null;

  if (!authed) {
    return (
      <main className="flex h-screen items-center justify-center bg-background px-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm"
        >
          <h1 className="text-lg font-semibold text-foreground">
            دخول الإدارة
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            autoFocus
            className="rounded-md border border-border-strong bg-background px-3 py-2 text-foreground outline-none focus:border-brand"
          />
          {error && <p className="text-sm text-brand">{error}</p>}
          <button
            type="submit"
            className="rounded-md bg-brand px-3 py-2 font-medium text-white hover:bg-brand-hover"
          >
            دخول
          </button>
        </form>
      </main>
    );
  }

  return <AdminShell />;
}
