import BrandMark from "../BrandMark";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <BrandMark />
      <div className="flex gap-1.5 px-1 py-2.5">
        <span className="h-1.75 w-1.75 animate-[mm-dot_1.2s_ease-in-out_infinite] rounded-full bg-brand" />
        <span className="h-1.75 w-1.75 animate-[mm-dot_1.2s_ease-in-out_infinite] rounded-full bg-brand [animation-delay:150ms]" />
        <span className="h-1.75 w-1.75 animate-[mm-dot_1.2s_ease-in-out_infinite] rounded-full bg-brand [animation-delay:300ms]" />
      </div>
    </div>
  );
}
