#!/usr/bin/env python
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.db.session import SessionLocal
from app.services.ingestion import ingest_document


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Ingest PDFs into the RAG document store"
    )
    parser.add_argument("files", nargs="+", type=Path, help="PDF files to ingest")
    args = parser.parse_args()

    with SessionLocal() as db:
        for path in args.files:
            print(f"Ingesting {path.name}...")
            document = ingest_document(db, path.name, path.read_bytes())
            print(
                f"  -> {len(document.chunks)} chunks stored (document_id={document.id})"
            )


if __name__ == "__main__":
    main()
