import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Header({ onToggleSidebar }) {
  return (
    <header className="flex h-16 flex-none items-center justify-between gap-4 border-b border-border px-5">
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          aria-label="القائمة"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground hover:bg-foreground/5"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex h-45 w-61.5 items-center justify-center overflow-hidden">
          <Image
            src="/almamlaka-logo.png"
            alt="المملكة"
            width={246}
            height={164}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
