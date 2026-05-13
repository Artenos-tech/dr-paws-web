"use client"

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import api, {
  type V3Owner,
  V3_AUTH_TOKEN_KEY,
  clearV3Auth,
  setV3AuthToken,
  v3GetMe,
} from "@/services/api.v3"

interface V3UserContextType {
  owner: V3Owner | null
  isLoggedIn: boolean | null
  login: (owner: V3Owner, token: string) => void
  logout: () => Promise<void>
  setOwner: (owner: V3Owner) => void
}

const V3UserContext = createContext<V3UserContextType | undefined>(undefined)

const POLL_INTERVAL_MS = 5 * 60 * 1000

export function V3UserProvider({ children }: { children: ReactNode }) {
  const [owner, setOwner_] = useState<V3Owner | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const inFlightRef = useRef(false)

  const validate = useCallback(async () => {
    if (inFlightRef.current) {
      return
    }
    if (typeof window === "undefined") {
      return
    }
    const token = localStorage.getItem(V3_AUTH_TOKEN_KEY)
    if (!token) {
      setOwner_(null)
      setIsLoggedIn(false)
      return
    }
    inFlightRef.current = true
    try {
      const fresh = await v3GetMe()
      setOwner_(fresh)
      setIsLoggedIn(true)
    } catch (e) {
      const status = (e as { status?: number })?.status
      if (status === 401) {
        clearV3Auth()
        setOwner_(null)
        setIsLoggedIn(false)
      } else {
        // Network or 5xx: don't log the user out on transient failures.
        // Trust the token until the next poll reconciles.
        setIsLoggedIn((prev) => (prev === null ? true : prev))
      }
    } finally {
      inFlightRef.current = false
    }
  }, [])

  useEffect(() => {
    validate()
  }, [validate])

  useEffect(() => {
    if (isLoggedIn !== true) {
      return
    }
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        validate()
      }
    }
    document.addEventListener("visibilitychange", onVisible)
    const interval = window.setInterval(validate, POLL_INTERVAL_MS)
    return () => {
      document.removeEventListener("visibilitychange", onVisible)
      window.clearInterval(interval)
    }
  }, [isLoggedIn, validate])

  const login = useCallback((owner: V3Owner, token: string) => {
    setV3AuthToken(token)
    setOwner_(owner)
    setIsLoggedIn(true)
  }, [])

  const setOwner = useCallback((updated: V3Owner) => {
    setOwner_(updated)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout({})
    } catch {
      // best-effort
    }
    clearV3Auth()
    setOwner_(null)
    setIsLoggedIn(false)
  }, [])

  return (
    <V3UserContext.Provider
      value={{ owner, isLoggedIn, login, logout, setOwner }}
    >
      {children}
    </V3UserContext.Provider>
  )
}

export function useV3UserContext() {
  const ctx = useContext(V3UserContext)
  if (!ctx)
    throw new Error("useV3UserContext must be used within V3UserProvider")
  return ctx
}
