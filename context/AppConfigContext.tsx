"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { clearAuthToken } from "@/services/api"
import { clearV3Auth } from "@/services/api.v3"

const CACHE_KEY = "appConfig.v3Enabled"
const CACHE_TTL_MS = 5 * 60 * 1000
const CACHE_TS_KEY = "appConfig.v3EnabledTs"
const PAYMENTS_CACHE_KEY = "appConfig.v3Payments"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

interface V3Config {
  v3Enabled: boolean
  clinicVisitPaymentsEnabled: boolean
  homeVisitPaymentsEnabled: boolean
}

interface AppConfigContextType {
  v3Enabled: boolean | null
  // Whether v3 bookings require online payment up-front. Null while unknown;
  // consumers should treat null as "not yet known" and fall back to the
  // pay-at-clinic copy until the real value arrives.
  clinicVisitPaymentsEnabled: boolean | null
  homeVisitPaymentsEnabled: boolean | null
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined,
)

function readV3EnabledCache(): boolean | null {
  if (typeof window === "undefined") return null
  try {
    const ts = localStorage.getItem(CACHE_TS_KEY)
    if (!ts || Date.now() - Number(ts) > CACHE_TTL_MS) return null
    const val = localStorage.getItem(CACHE_KEY)
    if (val === "true") return true
    if (val === "false") return false
  } catch {
    // ignore storage errors
  }
  return null
}

function readPaymentsCache(): Pick<
  V3Config,
  "clinicVisitPaymentsEnabled" | "homeVisitPaymentsEnabled"
> | null {
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

function writeCache(config: V3Config) {
  try {
    localStorage.setItem(CACHE_KEY, String(config.v3Enabled))
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()))
    localStorage.setItem(
      PAYMENTS_CACHE_KEY,
      JSON.stringify({
        clinicVisitPaymentsEnabled: config.clinicVisitPaymentsEnabled,
        homeVisitPaymentsEnabled: config.homeVisitPaymentsEnabled,
      }),
    )
  } catch {
    // ignore storage errors
  }
}

async function fetchV3Config(): Promise<V3Config> {
  const res = await fetch(`${API_BASE_URL}/config/v3-feature-flag`, {
    credentials: "include",
  })
  const json = await res.json()
  return {
    v3Enabled: json?.v3Enabled === true,
    clinicVisitPaymentsEnabled: json?.clinicVisitPaymentsEnabled === true,
    homeVisitPaymentsEnabled: json?.homeVisitPaymentsEnabled === true,
  }
}

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [v3Enabled, setV3Enabled] = useState<boolean | null>(() =>
    readV3EnabledCache(),
  )
  const [clinicVisitPaymentsEnabled, setClinicVisitPaymentsEnabled] = useState<
    boolean | null
  >(() => readPaymentsCache()?.clinicVisitPaymentsEnabled ?? null)
  const [homeVisitPaymentsEnabled, setHomeVisitPaymentsEnabled] = useState<
    boolean | null
  >(() => readPaymentsCache()?.homeVisitPaymentsEnabled ?? null)
  const v3EnabledRef = useRef<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      try {
        const config = await fetchV3Config()
        if (cancelled) return

        const prevValue = v3EnabledRef.current
        if (prevValue !== null && config.v3Enabled !== prevValue) {
          if (config.v3Enabled) {
            clearAuthToken() // non-V3 → V3: clear old Pettle token
          } else {
            clearV3Auth() // V3 → non-V3: clear Nidana token
          }
          window.location.href = "/"
          return
        }

        v3EnabledRef.current = config.v3Enabled
        setV3Enabled(config.v3Enabled)
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
      value={{
        v3Enabled,
        clinicVisitPaymentsEnabled,
        homeVisitPaymentsEnabled,
      }}
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
