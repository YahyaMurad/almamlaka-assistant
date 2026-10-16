export default function NewChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-11 items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-brand-hover"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
      محادثة جديدة
    </button>
  );
}
