"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import ClipLoader from "react-spinners/ClipLoader"
import toast, { Toaster } from "react-hot-toast"
import { CalendarX } from "lucide-react"
import AppointmentCard from "@/components/v3/AppointmentCard"
import {
  v3CancelAppointment,
  v3FetchAppointments,
  type V3AppointmentListItem,
} from "@/services/api.v3"

const PAGE_SIZE = 20

export default function V3AppointmentsPage() {
  const [items, setItems] = useState<V3AppointmentListItem[]>([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadingRef = useRef(false)

  const loadPage = useCallback(async (pageToLoad: number) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    setError(null)
    try {
      const { items: newItems, hasNext: more } = await v3FetchAppointments(
        pageToLoad,
        PAGE_SIZE,
      )
      setItems((prev) => (pageToLoad === 1 ? newItems : [...prev, ...newItems]))
      setHasNext(more)
      setPage(pageToLoad)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load appointments")
    } finally {
      setLoading(false)
      setInitialLoading(false)
      loadingRef.current = false
    }
  }, [])

  useEffect(() => {
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
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  if (!loading && !error && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <CalendarX className="h-12 w-12 text-gray-300 mb-3" />
        <h2 className="font-roca text-xl text-primary-1 mb-1">
          No appointments yet
        </h2>
        <p className="text-sm text-gray-500">
          When you book a visit, it will show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Toaster position="top-center" />
      <h1 className="font-roca text-2xl text-primary-1 mb-4">
        My Appointments
      </h1>

      <div className="space-y-3">
        {items.map((item) => (
          <AppointmentCard
            key={item.id}
            item={item}
            href={`/v3/appointments/${item.id}`}
            onCancel={async (id) => {
              try {
                await v3CancelAppointment(id)
              } catch (e) {
                const message =
                  e instanceof Error
                    ? e.message
                    : "Failed to cancel appointment"
                toast.error(message)
                throw e
              }
              setItems((prev) =>
                prev.map((it) => {
                  if (it.id !== id) return it
                  if (it.bookingType === "HOME_VISIT") {
                    return {
                      ...it,
                      visitStatus: "Cancelled",
                      canModifyOrCancel: false,
                    }
                  }
                  return {
                    ...it,
                    clinicStatus: "Cancelled",
                    canModifyOrCancel: false,
                  }
                }),
              )
              toast.success("Appointment cancelled")
            }}
          />
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
