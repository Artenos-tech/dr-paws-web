"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api"
import { Crosshair, MapPin, Search } from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"

const DEFAULT_PIN = { lat: 12.9716, lng: 77.5946 } // Bangalore
const LIBRARIES: "places"[] = ["places"]

export type GeocodedLocation = {
  lat: number
  lng: number
  formattedAddress: string
  pincode: string | null
  // Best-effort suggested line1 (street + sublocality if available).
  suggestedLine1: string
}

// "centered-pin": map drags under a fixed center pin (phone-native UX).
// "draggable-marker": legacy — user drags the marker; map snaps to it on release.
export type MapPickerMode = "centered-pin" | "draggable-marker"

type Props = {
  initial?: { lat: number; lng: number } | null
  onChange: (location: GeocodedLocation) => void
  height?: number
  mode?: MapPickerMode
}

export default function MapAddressPicker({
  initial,
  onChange,
  height = 280,
  mode = "centered-pin",
}: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  })

  const [pin, setPin] = useState<google.maps.LatLngLiteral>(
    initial ?? DEFAULT_PIN,
  )
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null)
  const [searchText, setSearchText] = useState("")
  const [locating, setLocating] = useState(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const mapRef = useRef<google.maps.Map | null>(null)
  // Used as the GoogleMap `center` prop. Frozen after mount so user pans
  // are not fought by re-renders. Programmatic moves go via mapRef.panTo.
  const initialCenter = useMemo(() => initial ?? DEFAULT_PIN, [])

  // Reverse-geocode whenever the pin moves and report back to the parent.
  useEffect(() => {
    if (!isLoaded) {
      return
    }
    let cancelled = false
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: pin }, (results, status) => {
      if (cancelled) {
        return
      }
      if (status !== "OK" || !results?.[0]) {
        onChangeRef.current({
          ...pin,
          formattedAddress: "",
          pincode: null,
          suggestedLine1: "",
        })
        return
      }
      const result = results[0]
      const formattedAddress = result.formatted_address
      const pincode =
        result.address_components.find((c) => c.types.includes("postal_code"))
          ?.long_name ?? null
      const route =
        result.address_components.find((c) => c.types.includes("route"))
          ?.long_name ?? ""
      const sublocality =
        result.address_components.find((c) =>
          c.types.includes("sublocality_level_1"),
        )?.long_name ??
        result.address_components.find((c) => c.types.includes("sublocality"))
          ?.long_name ??
        ""
      const number =
        result.address_components.find((c) => c.types.includes("street_number"))
          ?.long_name ?? ""
      const suggestedLine1 = [number, route, sublocality]
        .filter(Boolean)
        .join(", ")
      onChangeRef.current({
        ...pin,
        formattedAddress,
        pincode,
        suggestedLine1: suggestedLine1 || formattedAddress,
      })
    })
    return () => {
      cancelled = true
    }
  }, [isLoaded, pin.lat, pin.lng])

  // On mount, attempt geolocation once; ignore failures silently.
  useEffect(() => {
    if (initial) {
      return
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        panMapTo({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      undefined,
      { timeout: 5000, maximumAge: 60_000 },
    )
  }, [])

  function panMapTo(target: google.maps.LatLngLiteral) {
    // In centered-pin mode, onIdle picks up the new center and updates `pin`.
    // In draggable-marker mode, we update `pin` directly so the controlled
    // `center` prop re-centers the map and the marker follows.
    if (mode === "centered-pin" && mapRef.current) {
      mapRef.current.panTo(target)
    } else {
      setPin(target)
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        panMapTo({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  function handlePlaceChanged() {
    if (!autocomplete) {
      return
    }
    const place = autocomplete.getPlace()
    if (!place.geometry?.location) {
      return
    }
    panMapTo({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    })
    setSearchText("")
  }

  function handleMapIdle() {
    if (mode !== "centered-pin") {
      return
    }
    const map = mapRef.current
    if (!map) {
      return
    }
    const center = map.getCenter()
    if (!center) {
      return
    }
    const lat = center.lat()
    const lng = center.lng()
    setPin((prev) =>
      prev.lat === lat && prev.lng === lng ? prev : { lat, lng },
    )
  }

  function handleMapClick(e: google.maps.MapMouseEvent) {
    if (mode !== "draggable-marker" || !e.latLng) {
      return
    }
    setPin(e.latLng.toJSON())
  }

  function handleMarkerDrag(e: google.maps.MapMouseEvent) {
    if (!e.latLng) {
      return
    }
    setPin(e.latLng.toJSON())
  }

  if (!isLoaded) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50"
        style={{ height }}
      >
        <ClipLoader color="#33495f" size={24} />
      </div>
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200">
      <GoogleMap
        center={mode === "centered-pin" ? initialCenter : pin}
        zoom={16}
        mapContainerStyle={{ width: "100%", height: `${height}px` }}
        onLoad={(map) => {
          mapRef.current = map
        }}
        onUnmount={() => {
          mapRef.current = null
        }}
        onIdle={handleMapIdle}
        onClick={handleMapClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          clickableIcons: false,
        }}
      >
        {mode === "draggable-marker" && (
          <Marker position={pin} draggable onDragEnd={handleMarkerDrag} />
        )}
      </GoogleMap>

      {mode === "centered-pin" && (
        // Fixed centered pin overlay. pointer-events-none so gestures pass through.
        <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
          <MapPin
            className="h-9 w-9 text-red-600 drop-shadow-md"
            fill="currentColor"
            strokeWidth={1.5}
            // Offset upward so the pin's tip sits on the true map center.
            style={{ transform: "translateY(-50%)" }}
          />
        </div>
      )}

      <div className="absolute top-2 left-2 right-2 z-10">
        <Autocomplete
          onLoad={setAutocomplete}
          onPlaceChanged={handlePlaceChanged}
          options={{ componentRestrictions: { country: "in" } }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search area, street, or landmark"
              className="w-full rounded-full border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-secondary-1"
            />
          </div>
        </Autocomplete>
      </div>

      <button
        type="button"
        onClick={useCurrentLocation}
        disabled={locating}
        title="Use my current location"
        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-md hover:bg-gray-50 disabled:opacity-60"
      >
        {locating ? (
          <ClipLoader color="#33495f" size={12} />
        ) : (
          <Crosshair className="h-3.5 w-3.5" />
        )}
        My location
      </button>
    </div>
  )
}
