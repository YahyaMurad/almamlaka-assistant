import uuid
from pathlib import Path

STORAGE_DIR = Path(__file__).resolve().parent.parent.parent / "storage" / "documents"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)


def document_file_path(document_id: uuid.UUID) -> Path:
    return STORAGE_DIR / f"{document_id}.pdf"


def save_document_file(document_id: uuid.UUID, file_bytes: bytes) -> None:
    document_file_path(document_id).write_bytes(file_bytes)
