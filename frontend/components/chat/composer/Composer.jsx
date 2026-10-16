import ChatInput from "./ChatInput";

export default function Composer({ draft, onDraftChange, onSend }) {
  return (
    <div className="flex-none px-6 pb-4.5 pt-2">
      <div className="mx-auto max-w-3xl">
        <ChatInput value={draft} onChange={onDraftChange} onSend={onSend} />
        <p className="mt-2 text-center text-xs text-muted">
          قد يخطئ المساعد أحياناً. تحقق من الأخبار المهمة عبر موقع المملكة.
        </p>
      </div>
    </div>
  );
}
