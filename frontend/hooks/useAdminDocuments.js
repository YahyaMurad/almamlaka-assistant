"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteDocument,
  listDocuments,
  uploadDocument,
} from "@/lib/documentsApi";

export function useAdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setDocuments(await listDocuments());
    } catch {
      setLoadError("تعذر تحميل قائمة المستندات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (file) => {
      setUploading(true);
      setUploadError("");
      try {
        await uploadDocument(file);
        await refresh();
      } catch (err) {
        setUploadError(err.message || "فشل رفع الملف");
      } finally {
        setUploading(false);
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (documentId) => {
      setDeletingId(documentId);
      setDeleteError("");
      try {
        await deleteDocument(documentId);
        await refresh();
      } catch (err) {
        setDeleteError(err.message || "فشل حذف الملف");
      } finally {
        setDeletingId(null);
      }
    },
    [refresh],
  );

  return {
    documents,
    loading,
    loadError,
    uploading,
    uploadError,
    upload,
    deletingId,
    deleteError,
    remove,
  };
}
