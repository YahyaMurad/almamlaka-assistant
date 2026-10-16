export default function UserMessage({ text }) {
  return (
    <div className="flex justify-start">
      <div
        dir="auto"
        className="max-w-[78%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-surface-sunken px-4 py-3 text-base leading-7 text-foreground"
      >
        {text}
      </div>
    </div>
  );
}
