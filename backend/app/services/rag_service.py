import re
import uuid
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.documents import Document, DocumentChunk
from app.models.usage import UsageEventType
from app.services.openai_service import embed_texts, translate_to_english
from app.services.usage_service import record_chat_usage, record_embedding_usage

_ARABIC_RE = re.compile(r"[؀-ۿ]")

DEFAULT_TOP_K = 5
MAX_DISTANCE = 0.8

PERSONA_SYSTEM_PROMPT = """You are MamlakaBot, the internal assistant for Almamlaka TV's \
Digital Expansion Initiative (DEI). You help the project team look up facts from the DEI's \
official project documents (project overview, budget & timeline, team & governance), and you \
can also hold a normal conversation on topics outside the DEI.

Strict rules, in priority order:
1. For any question about the DEI (budget, dates, team, governance, policies), answer ONLY \
from the document context given to you in a separate system message. Never invent or guess a \
project fact — a date, a dollar figure, a person's name or role, a policy — that isn't \
explicitly in that context.
2. The documents sometimes contain more than one figure for the same thing because a value was \
later revised (e.g. an original budget and a Finance Committee revision; an original launch \
date and a steering-committee-approved new date). When that happens, treat the value with the \
later date as authoritative, state that value as the answer, and explicitly name the earlier \
value and why it changed. Never report a superseded figure as current.
3. When you use a fact from the context, cite it inline with its bracketed number, e.g. "the \
launch date is April 1, 2027 [2]".
4. If the context doesn't contain the answer to a DEI question, say plainly that the documents \
don't cover it — don't guess and don't fall back to general knowledge for DEI-specific facts.
5. For anything unrelated to the DEI, do not answer it, refrain from conversing in anything unrelated to the DEI. Never claim to \
be ChatGPT, GPT, or any other identity — you are MamlakaBot.

Be concise and factual. Avoid filler, hedging, and unnecessary apologies."""

RAG_CONTEXT_PROMPT = """Context retrieved from the DEI project documents for this question, \
numbered and tagged with their source file and page. Apply the rules above, especially the \
rule on resolving superseded figures.

{context}"""


@dataclass
class RetrievedChunk:
    content: str
    filename: str
    document_id: uuid.UUID
    page: int
    section_title: str | None
    distance: float


def retrieve_relevant_chunks(
    db: Session,
    query: str,
    k: int = DEFAULT_TOP_K,
    max_distance: float = MAX_DISTANCE,
    conversation_id: uuid.UUID | None = None,
) -> list[RetrievedChunk]:
    if _ARABIC_RE.search(query):
        search_query, prompt_tokens, completion_tokens = translate_to_english(query)
        record_chat_usage(
            db,
            model=get_settings().openai_model,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            event_type=UsageEventType.TRANSLATION,
            conversation_id=conversation_id,
        )
    else:
        search_query = query

    (query_embedding,), embedding_tokens = embed_texts([search_query])
    record_embedding_usage(
        db,
        model=get_settings().openai_embedding_model,
        total_tokens=embedding_tokens,
        conversation_id=conversation_id,
    )
    distance = DocumentChunk.embedding.cosine_distance(query_embedding)

    rows = db.execute(
        select(
            DocumentChunk.content,
            DocumentChunk.page,
            DocumentChunk.section_title,
            Document.id,
            Document.filename,
            distance.label("distance"),
        )
        .join(Document, Document.id == DocumentChunk.document_id)
        .order_by(distance)
        .limit(k)
    ).all()

    return [
        RetrievedChunk(
            content=row.content,
            filename=row.filename,
            document_id=row.id,
            page=row.page,
            section_title=row.section_title,
            distance=row.distance,
        )
        for row in rows
        if row.distance <= max_distance
    ]


def build_context_block(chunks: list[RetrievedChunk]) -> str:
    def label(chunk: RetrievedChunk) -> str:
        location = f"{chunk.filename}, p.{chunk.page}"
        if chunk.section_title:
            location += f', "{chunk.section_title}"'
        return location

    return "\n\n".join(
        f"[{i}] {label(chunk)}\n{chunk.content}"
        for i, chunk in enumerate(chunks, start=1)
    )


def build_sources(chunks: list[RetrievedChunk]) -> list[dict]:
    return [
        {
            "title": chunk.filename,
            "section": chunk.section_title or f"ص. {chunk.page}",
            "document_id": str(chunk.document_id),
            "page": chunk.page,
        }
        for chunk in chunks
    ]


def build_rag_messages(
    db: Session,
    query: str,
    history: list[dict],
    conversation_id: uuid.UUID | None = None,
) -> tuple[list[dict], list[dict]]:
    messages = [{"role": "system", "content": PERSONA_SYSTEM_PROMPT}, *history]

    chunks = retrieve_relevant_chunks(db, query, conversation_id=conversation_id)
    if not chunks:
        return messages, []

    context_message = {
        "role": "system",
        "content": RAG_CONTEXT_PROMPT.format(context=build_context_block(chunks)),
    }
    return [messages[0], context_message, *messages[1:]], build_sources(chunks)
