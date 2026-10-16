import BrandMark from "../BrandMark";
import SuggestionGrid from "./SuggestionGrid";
import { SUGGESTIONS } from "@/lib/suggestions";

export default function EmptyState({ onSelectSuggestion }) {
  return (
    <div className="flex flex-col items-center gap-3.5 px-0 pb-3 pt-12 text-center">
      <BrandMark size={72} className="rounded-2xl text-2xl" />
      <h1 className="mt-1.5 text-3xl font-bold text-foreground">كيف يمكنني مساعدتك اليوم؟</h1>
      <p className="max-w-[460px] text-base leading-7 text-foreground-secondary">
        اسأل عن آخر الأخبار، مواعيد البرامج، أو أي موضوع تغطيه قناة المملكة.
      </p>
      <SuggestionGrid suggestions={SUGGESTIONS} onSelect={onSelectSuggestion} />
    </div>
  );
}
