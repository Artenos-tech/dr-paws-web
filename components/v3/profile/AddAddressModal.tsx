"use client"

import { useEffect, useState } from "react"
import MapAddressPicker, {
  type GeocodedLocation,
} from "@/components/v3/booking/MapAddressPicker"
import { v3CreateAddress, type V3Address } from "@/services/api.v3"

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </div>
      {children}
    </label>
  )
}

export default function AddAddressModal({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: (address: V3Address) => void
}) {
  const [location, setLocation] = useState<GeocodedLocation | null>(null)
  const [pinAcked, setPinAcked] = useState(false)
  const [tag, setTag] = useState("")
  const [line1, setLine1] = useState("")
  const [line1EditedByUser, setLine1EditedByUser] = useState(false)
  const [line2, setLine2] = useState("")
  const [directions, setDirections] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!location) return
    if (!line1EditedByUser) {
      setLine1(location.suggestedLine1)
    }
  }, [location, line1EditedByUser])

  const canConfirmPin = !!location?.formattedAddress && !!location?.pincode

  async function handleSave() {
    if (!location || !location.pincode) {
      setError("Pick a location on the map first")
      return
    }
    if (!line1.trim()) {
      setError("Address line 1 is required")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const created = await v3CreateAddress({
        tag: tag.trim() || null,
        line1: line1.trim(),
        line2: line2.trim() || null,
        pincode: location.pincode,
        latitude: location.lat,
        longitude: location.lng,
        directions: directions.trim() || null,
      })
      onSaved(created)
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message ?? "Failed to save address")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-white max-h-[95vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 className="font-semibold text-primary-1 text-lg">
            {pinAcked ? "Address details" : "Add a new address"}
          </h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!pinAcked ? (
            <>
              <p className="text-xs text-gray-500 mb-3">
                Search or click on the map to drop a pin on your location.
              </p>
              <MapAddressPicker
                onChange={(loc) => setLocation(loc)}
                height={320}
              />
              {location?.formattedAddress && (
                <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">
                    Selected
                  </span>
                  {location.formattedAddress}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="rounded-xl bg-gray-50 px-3 py-2 mb-4 flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                    Pinned location
                  </div>
                  <div className="text-sm text-gray-700 truncate">
                    {location?.formattedAddress ?? ""}
                  </div>
                </div>
                <button
                  onClick={() => setPinAcked(false)}
                  className="text-xs font-medium text-primary-2 hover:underline flex-shrink-0"
                >
                  Change
                </button>
              </div>
              <div className="space-y-3">
                <Field label="Tag (optional)">
                  <input
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Home, Office..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
                  />
                </Field>
                <Field label="Address line 1">
                  <input
                    value={line1}
                    onChange={(e) => {
                      setLine1(e.target.value)
                      setLine1EditedByUser(true)
                    }}
                    placeholder="House / flat, street"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
                  />
                </Field>
                <Field label="Address line 2 (optional)">
                  <input
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Apartment, building, area"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
                  />
                </Field>
                <Field label="Directions (optional)">
                  <textarea
                    value={directions}
                    onChange={(e) => setDirections(e.target.value)}
                    rows={2}
                    placeholder="Landmark, gate code, parking..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm resize-none focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
                  />
                </Field>
              </div>
            </>
          )}

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
          {!pinAcked ? (
            <button
              onClick={() => {
                if (!canConfirmPin) return
                setError(null)
                setPinAcked(true)
              }}
              disabled={!canConfirmPin}
              className="w-full rounded-xl bg-secondary-1 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              Confirm location
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={submitting}
              className="w-full rounded-xl bg-secondary-1 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save address"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
