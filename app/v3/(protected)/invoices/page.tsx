"use client"

import { useEffect, useState } from "react"
import ClipLoader from "react-spinners/ClipLoader"
import { v3FetchDocuments, type V3DocumentCounts } from "@/services/api.v3"
import DocumentTabs, { type TabDef } from "@/components/v3/records/DocumentTabs"

const INVOICE_TABS: TabDef[] = [
  { type: "invoice", label: "Invoices", countKey: "invoices" },
  { type: "credit_note", label: "Credit Notes", countKey: "credit_notes" },
  { type: "estimate", label: "Estimates", countKey: "estimates" },
  {
    type: "payment_receipt",
    label: "Receipts",
    countKey: "payment_receipts",
  },
]

export default function InvoicesPage() {
  const [counts, setCounts] = useState<V3DocumentCounts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    v3FetchDocuments({})
      .then(({ counts }) => setCounts(counts))
      .catch(() => setCounts(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="font-roca text-2xl text-primary-1 mb-5">Invoices</h1>
      <DocumentTabs tabs={INVOICE_TABS} counts={counts} />
    </div>
  )
}
