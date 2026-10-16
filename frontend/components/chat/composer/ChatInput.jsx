"use client";

export default function ChatInput({ value, onChange, onSend }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="flex items-end gap-2.5 rounded-[10px] border border-border-strong bg-surface p-2.5 shadow-[0_4px_18px_rgba(0,0,0,0.42)] transition-shadow focus-within:border-brand focus-within:shadow-[0_6px_24px_rgba(0,0,0,0.46)]">
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="اكتب سؤالك هنا…"
        className="max-h-40 min-w-0 flex-1 resize-none border-none bg-transparent px-1.5 py-2 text-base leading-6 text-foreground outline-none"
      />
      <button
        onClick={onSend}
        aria-label="إرسال"
        className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-hover"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      </button>
    </div>
  );
}
