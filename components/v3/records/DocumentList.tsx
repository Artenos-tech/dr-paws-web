"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FileX } from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import {
  v3FetchDocuments,
  type V3Document,
  type V3DocumentType,
} from "@/services/api.v3"
import DocumentCard from "./DocumentCard"

const PAGE_SIZE = 20

interface Props {
  type: V3DocumentType
  petId?: string
}

export default function DocumentList({ type, petId }: Props) {
  const [items, setItems] = useState<V3Document[]>([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadingRef = useRef(false)

  const loadPage = useCallback(
    async (pageToLoad: number) => {
      if (loadingRef.current) return
      loadingRef.current = true
      setLoading(true)
      setError(null)
      try {
        const { documents, hasNext: more } = await v3FetchDocuments({
          type,
          petId,
          page: pageToLoad,
          pageSize: PAGE_SIZE,
        })
        setItems((prev) =>
          pageToLoad === 1 ? documents : [...prev, ...documents],
        )
        setHasNext(more)
        setPage(pageToLoad)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load documents")
      } finally {
        setLoading(false)
        setInitialLoading(false)
        loadingRef.current = false
      }
    },
    [type, petId],
  )

  useEffect(() => {
    setItems([])
    setPage(1)
    setHasNext(true)
    setInitialLoading(true)
    loadPage(1)
  }, [loadPage])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNext || initialLoading) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current && hasNext) {
          loadPage(page + 1)
        }
      },
      { rootMargin: "200px" },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNext, initialLoading, page, loadPage])

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  if (!loading && !error && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileX className="h-10 w-10 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No documents found.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-3">
        {items.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={() => loadPage(page === 0 ? 1 : page + 1)}
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      )}

      {hasNext && (
        <div
          ref={sentinelRef}
          className="flex justify-center items-center py-6"
        >
          {loading && <ClipLoader color="#33495f" size={24} />}
        </div>
      )}
    </div>
  )
}
