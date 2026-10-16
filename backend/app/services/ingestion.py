import io
import re

from pypdf import PdfReader
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.documents import Document, DocumentChunk
from app.models.usage import UsageEventType
from app.services.openai_service import embed_texts
from app.services.storage import save_document_file
from app.services.usage_service import record_embedding_usage

CHUNK_SIZE = 800
CHUNK_OVERLAP = 150

_SECTION_HEADER_RE = re.compile(r"^(\d{1,2}\.\s+[A-Z][^\n]{0,78})$", re.MULTILINE)


def extract_pages(file_bytes: bytes) -> list[str]:
    reader = PdfReader(io.BytesIO(file_bytes))
    return [page.extract_text() or "" for page in reader.pages]


def split_sections(text: str) -> list[tuple[str | None, str]]:
    matches = list(_SECTION_HEADER_RE.finditer(text))
    if not matches:
        return [(None, text)]

    sections: list[tuple[str | None, str]] = []

    preamble = text[: matches[0].start()].strip()
    if preamble:
        sections.append((None, preamble))

    for i, match in enumerate(matches):
        title = match.group(1).strip()
        body_start = match.end()
        body_end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[body_start:body_end].strip()
        if body:
            sections.append((title, body))

    return sections


def chunk_text(
    text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP
) -> list[str]:
    text = text.strip()
    if not text:
        return []

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end].strip())
        if end >= len(text):
            break
        start = end - overlap
    return [chunk for chunk in chunks if chunk]


def ingest_document(db: Session, filename: str, file_bytes: bytes) -> Document:
    document = Document(filename=filename)
    db.add(document)
    db.flush()
    save_document_file(document.id, file_bytes)

    page_chunks: list[tuple[int, int, str | None, str]] = []
    for page_number, page_text in enumerate(extract_pages(file_bytes), start=1):
        chunk_index = 0
        for section_title, section_body in split_sections(page_text):
            for piece in chunk_text(section_body):
                page_chunks.append((page_number, chunk_index, section_title, piece))
                chunk_index += 1

    if not page_chunks:
        db.commit()
        db.refresh(document)
        return document

    embeddings, total_tokens = embed_texts([chunk for _, _, _, chunk in page_chunks])
    record_embedding_usage(
        db,
        model=get_settings().openai_embedding_model,
        total_tokens=total_tokens,
        event_type=UsageEventType.EMBEDDING,
    )

    for (page_number, chunk_index, section_title, chunk), embedding in zip(
        page_chunks, embeddings
    ):
        db.add(
            DocumentChunk(
                document_id=document.id,
                page=page_number,
                chunk_index=chunk_index,
                section_title=section_title,
                content=chunk,
                embedding=embedding,
            )
        )

    db.commit()
    db.refresh(document)
    return document
