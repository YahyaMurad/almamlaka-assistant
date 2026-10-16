"use client";

import { useAdminDocuments } from "@/hooks/useAdminDocuments";
import DocumentUpload from "./DocumentUpload";
import DocumentList from "./DocumentList";

export default function DocumentsPanel() {
  const {
    documents,
    loading,
    loadError,
    uploading,
    uploadError,
    upload,
    deletingId,
    deleteError,
    remove,
  } = useAdminDocuments();

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto bg-canvas p-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">المستندات</h1>
        <p className="mt-1 text-sm text-muted">
          ارفع ملفات PDF لإدراجها في قاعدة معرفة المساعد.
        </p>
      </div>

      <DocumentUpload
        uploading={uploading}
        error={uploadError}
        onUpload={upload}
      />

      {deleteError && <p className="text-sm text-brand">{deleteError}</p>}

      <DocumentList
        documents={documents}
        loading={loading}
        error={loadError}
        deletingId={deletingId}
        onDelete={remove}
      />
    </main>
  );
}
