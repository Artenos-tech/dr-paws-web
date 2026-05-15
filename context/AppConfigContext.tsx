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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

interface AppConfigContextType {
  v3Enabled: boolean | null
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined,
)

function readCache(): boolean | null {
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

function writeCache(value: boolean) {
  try {
    localStorage.setItem(CACHE_KEY, String(value))
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()))
  } catch {
    // ignore storage errors
  }
}

async function fetchV3Flag(): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/config/v3-feature-flag`, {
    credentials: "include",
  })
  const json = await res.json()
  return json?.v3Enabled === true
}

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [v3Enabled, setV3Enabled] = useState<boolean | null>(() => readCache())
  const v3EnabledRef = useRef<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      try {
        const newValue = await fetchV3Flag()
        if (cancelled) return

        const prevValue = v3EnabledRef.current
        if (prevValue !== null && newValue !== prevValue) {
          if (newValue) {
            clearAuthToken() // non-V3 → V3: clear old Pettle token
          } else {
            clearV3Auth() // V3 → non-V3: clear Nidana token
          }
          window.location.href = "/"
          return
        }

        v3EnabledRef.current = newValue
        setV3Enabled(newValue)
        writeCache(newValue)
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
    <AppConfigContext.Provider value={{ v3Enabled }}>
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
