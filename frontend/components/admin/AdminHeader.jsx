import Image from "next/image";
import ThemeToggle from "@/components/chat/ThemeToggle";

export default function AdminHeader() {
  return (
    <header className="flex h-16 flex-none items-center justify-between gap-4 border-b border-border px-5">
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
      <ThemeToggle />
    </header>
  );
}
