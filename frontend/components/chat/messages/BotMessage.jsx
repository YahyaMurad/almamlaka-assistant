import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import BrandMark from "../BrandMark";
import SourceList from "./SourceList";
import { normalizeMath } from "@/lib/normalizeMath";

const markdownComponents = {
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
};

export default function BotMessage({ text, sources }) {
  return (
    <div className="flex items-start gap-3">
      <BrandMark />
      <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
        <div dir="auto" className="prose prose-base max-w-none break-words leading-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={markdownComponents}
          >
            {normalizeMath(text)}
          </ReactMarkdown>
        </div>
        <SourceList sources={sources} />
      </div>
    </div>
  );
}
