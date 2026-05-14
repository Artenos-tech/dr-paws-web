"use client"

import { useEffect, useRef, useState } from "react"
import { FileText, Eye, Download, Loader2 } from "lucide-react"
import {
  v3GetDocumentDownloadUrl,
  type V3Document,
  type V3DocumentType,
} from "@/services/api.v3"

// These types may need async PDF regeneration — poll until isGenerating=false
const ASYNC_TYPES = new Set(["emr", "prescription"])
const POLL_INTERVAL_MS = 3500
const MAX_POLL_ATTEMPTS = 12

type Action = "view" | "download"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatAmount(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`
}

// The pre-signed S3 URL from Nidana has Content-Disposition: attachment, so
// window.open() on it always triggers a download. To view inline (PDFs, images),
// we fetch the file as a blob first — blob object URLs have no Content-Disposition,
// so the browser renders them inline based on Content-Type.
async function fetchBlob(
  url: string,
): Promise<{ objectUrl: string; blob: Blob } | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const blob = await res.blob()
    return { objectUrl: URL.createObjectURL(blob), blob }
  } catch {
    return null
  }
}

async function viewUrl(url: string) {
  const result = await fetchBlob(url)
  if (result) {
    window.open(result.objectUrl, "_blank", "noopener,noreferrer")
    // Keep alive long enough for the user to read; browser cleans up on tab close anyway
    setTimeout(() => URL.revokeObjectURL(result.objectUrl), 5 * 60 * 1000)
  } else {
    // CORS blocked — direct link still works for download, not ideal for view
    window.open(url, "_blank", "noopener,noreferrer")
  }
}

async function downloadUrl(url: string, fileName: string) {
  const result = await fetchBlob(url)
  if (result) {
    const a = document.createElement("a")
    a.href = result.objectUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(result.objectUrl), 10000)
  } else {
    // CORS blocked — fall back to direct link (browser will download)
    window.open(url, "_blank", "noopener,noreferrer")
  }
}

function FileRow({
  downloadId,
  type,
  name,
}: {
  downloadId: string
  type: V3DocumentType
  name: string
}) {
  const [activeAction, setActiveAction] = useState<Action | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingActionRef = useRef<Action | null>(null)
  const attemptsRef = useRef(0)

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  async function executeAction(url: string, fileName: string, action: Action) {
    if (action === "view") {
      viewUrl(url)
    } else {
      await downloadUrl(url, fileName)
    }
  }

  async function pollForUrl() {
    attemptsRef.current += 1
    if (attemptsRef.current > MAX_POLL_ATTEMPTS) {
      stopPolling()
      setActiveAction(null)
      setIsGenerating(false)
      setErrorMsg("PDF generation timed out. Please try again.")
      return
    }
    try {
      const result = await v3GetDocumentDownloadUrl(downloadId, type)
      if (!result.isGenerating && result.url) {
        stopPolling()
        setIsGenerating(false)
        setActiveAction(null)
        await executeAction(result.url, result.fileName, pendingActionRef.current!)
      }
    } catch {
      stopPolling()
      setActiveAction(null)
      setIsGenerating(false)
      setErrorMsg("Failed to fetch download link.")
    }
  }

  async function handleAction(action: Action) {
    if (activeAction) return
    setActiveAction(action)
    setErrorMsg(null)

    try {
      const result = await v3GetDocumentDownloadUrl(downloadId, type)

      if (!result.isGenerating && result.url) {
        setActiveAction(null)
        await executeAction(result.url, result.fileName, action)
        return
      }

      if (ASYNC_TYPES.has(type)) {
        pendingActionRef.current = action
        attemptsRef.current = 0
        setIsGenerating(true)
        pollRef.current = setInterval(pollForUrl, POLL_INTERVAL_MS)
      } else {
        setActiveAction(null)
        setErrorMsg("Download link unavailable. Please try again.")
      }
    } catch {
      setActiveAction(null)
      setErrorMsg("Failed to fetch download link.")
    }
  }

  const busy = activeAction !== null

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-500 truncate">{name}</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <ActionButton
            icon={<Eye className="h-3 w-3" />}
            label="View"
            loading={activeAction === "view"}
            disabled={busy}
            onClick={() => handleAction("view")}
          />
          <ActionButton
            icon={<Download className="h-3 w-3" />}
            label="Download"
            loading={activeAction === "download"}
            disabled={busy}
            onClick={() => handleAction("download")}
          />
        </div>
      </div>
      {isGenerating && (
        <p className="mt-1 text-xs text-amber-600">
          Generating PDF, this may take a few seconds…
        </p>
      )}
      {errorMsg && <p className="mt-1 text-xs text-red-600">{errorMsg}</p>}
    </div>
  )
}

function ActionButton({
  icon,
  label,
  loading,
  disabled,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  loading: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-primary-2 hover:bg-primary-2/5 hover:border-primary-2 transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : icon}
      {label}
    </button>
  )
}

interface Props {
  document: V3Document
}

export default function DocumentCard({ document: doc }: Props) {
  const fileRows =
    doc.files.length > 0
      ? doc.files.map((f) => ({ downloadId: f.downloadId, name: f.name }))
      : [{ downloadId: doc.id, name: doc.name }]

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Document info */}
      <div className="flex items-start gap-2 mb-3">
        <FileText className="h-4 w-4 text-primary-2 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-primary-1 truncate">
            {doc.name}
          </h3>
          <div className="text-xs text-gray-500 space-y-0.5 mt-0.5">
            <div>{formatDate(doc.createdAt)}</div>
            {doc.petName && <div>Pet: {doc.petName}</div>}
            {doc.doctorName && <div>By: {doc.doctorName}</div>}
            {doc.amount != null && (
              <div className="font-medium text-gray-700">
                {formatAmount(doc.amount)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Per-file rows with individual View/Download actions */}
      <div className="border-t border-gray-100 pt-2 space-y-2">
        {fileRows.map((row) => (
          <FileRow
            key={row.downloadId}
            downloadId={row.downloadId}
            type={doc.type}
            name={row.name}
          />
        ))}
      </div>
    </div>
  )
}
