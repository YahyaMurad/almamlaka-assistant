import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.documents import Document
from app.schemas.document import DocumentOut
from app.services.ingestion import ingest_document
from app.services.storage import document_file_path

router = APIRouter(prefix="/documents", tags=["documents"])

MAX_UPLOAD_BYTES = 20 * 1024 * 1024


def _is_pdf(file: UploadFile) -> bool:
    return file.content_type == "application/pdf" or (
        file.filename or ""
    ).lower().endswith(".pdf")


@router.get("", response_model=list[DocumentOut])
def list_documents(db: Session = Depends(get_db)) -> list[DocumentOut]:
    documents = (
        db.execute(select(Document).order_by(Document.created_at.desc()))
        .scalars()
        .all()
    )
    return [
        DocumentOut(
            id=document.id,
            filename=document.filename,
            chunk_count=len(document.chunks),
            created_at=document.created_at,
        )
        for document in documents
    ]


@router.post("", response_model=DocumentOut)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> DocumentOut:
    if not _is_pdf(file):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = file.file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    if len(file_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=400, detail="File exceeds the 20MB upload limit"
        )

    document = ingest_document(db, file.filename, file_bytes)
    return DocumentOut(
        id=document.id,
        filename=document.filename,
        chunk_count=len(document.chunks),
        created_at=document.created_at,
    )


@router.delete("/{document_id}", status_code=204)
def delete_document(document_id: uuid.UUID, db: Session = Depends(get_db)) -> None:
    document = db.get(Document, document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(document)
    db.commit()
    document_file_path(document_id).unlink(missing_ok=True)


@router.get("/{document_id}/file")
def get_document_file(
    document_id: uuid.UUID, db: Session = Depends(get_db)
) -> FileResponse:
    document = db.get(Document, document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    path = document_file_path(document_id)
    if not path.exists():
        raise HTTPException(status_code=404, detail="File not stored for this document")

    return FileResponse(path, media_type="application/pdf", filename=document.filename)
