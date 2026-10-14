"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
const CACHE_TTL_MS = 5 * 60 * 1000
const CACHE_TS_KEY = "appConfig.v3EnabledTs"
const PAYMENTS_CACHE_KEY = "appConfig.v3Payments"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

interface PaymentsConfig {
  clinicVisitPaymentsEnabled: boolean
  homeVisitPaymentsEnabled: boolean
}

interface AppConfigContextType {
  // Whether bookings require online payment up-front. Null while unknown;
  // consumers should treat null as "not yet known" and fall back to the
  // pay-at-clinic copy until the real value arrives.
  clinicVisitPaymentsEnabled: boolean | null
  homeVisitPaymentsEnabled: boolean | null
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined,
)

function readPaymentsCache(): PaymentsConfig | null {
  if (typeof window === "undefined") return null
  try {
    const ts = localStorage.getItem(CACHE_TS_KEY)
    if (!ts || Date.now() - Number(ts) > CACHE_TTL_MS) return null
    const raw = localStorage.getItem(PAYMENTS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      clinicVisitPaymentsEnabled: parsed?.clinicVisitPaymentsEnabled === true,
      homeVisitPaymentsEnabled: parsed?.homeVisitPaymentsEnabled === true,
    }
  } catch {
    // ignore storage errors
  }
  return null
}

function writeCache(config: PaymentsConfig) {
  try {
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()))
    localStorage.setItem(PAYMENTS_CACHE_KEY, JSON.stringify(config))
  } catch {
    // ignore storage errors
  }
}

async function fetchPaymentsConfig(): Promise<PaymentsConfig> {
  const res = await fetch(`${API_BASE_URL}/config/v3-feature-flag`, {
    credentials: "include",
  })
  const json = await res.json()
  return {
    clinicVisitPaymentsEnabled: json?.clinicVisitPaymentsEnabled === true,
    homeVisitPaymentsEnabled: json?.homeVisitPaymentsEnabled === true,
  }
}

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [clinicVisitPaymentsEnabled, setClinicVisitPaymentsEnabled] = useState<
    boolean | null
  >(() => readPaymentsCache()?.clinicVisitPaymentsEnabled ?? null)
  const [homeVisitPaymentsEnabled, setHomeVisitPaymentsEnabled] = useState<
    boolean | null
  >(() => readPaymentsCache()?.homeVisitPaymentsEnabled ?? null)

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      try {
        const config = await fetchPaymentsConfig()
        if (cancelled) return
        setClinicVisitPaymentsEnabled(config.clinicVisitPaymentsEnabled)
        setHomeVisitPaymentsEnabled(config.homeVisitPaymentsEnabled)
        writeCache(config)
      } catch {
        // On failure, keep whatever we have from cache / previous state
      }
    }

    refresh()

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      cancelled = true
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  return (
    <AppConfigContext.Provider
      value={{ clinicVisitPaymentsEnabled, homeVisitPaymentsEnabled }}
    >
      {children}
    </AppConfigContext.Provider>
  )
}

export function useAppConfig(): AppConfigContextType {
  const ctx = useContext(AppConfigContext)
  if (!ctx)
    throw new Error("useAppConfig must be used within AppConfigProvider")
  return ctx
}
