export default function SuggestionGrid({ suggestions, onSelect }) {
  return (
    <div className="mt-4.5 grid w-full grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.text}
          onClick={() => onSelect(suggestion.text)}
          className="flex flex-col items-start gap-1 rounded-lg border border-border-strong bg-surface px-4 py-3.5 text-right shadow-[0_2px_8px_rgba(0,0,0,0.40)] transition-all hover:border-brand hover:bg-brand-tint hover:shadow-[0_6px_16px_rgba(0,0,0,0.24)]"
        >
          <span className="text-xs font-semibold text-brand">
            {suggestion.tag}
          </span>
          <span className="text-[15px] font-medium leading-6 text-foreground">
            {suggestion.text}
          </span>
        </button>
      ))}
    </div>
  );
}
