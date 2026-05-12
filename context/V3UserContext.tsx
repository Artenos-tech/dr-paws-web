"use client"

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import api, {
  type V3Owner,
  V3_OWNER_KEY,
  V3_AUTH_TOKEN_KEY,
  clearV3Auth,
  setV3AuthToken,
} from "@/services/api.v3"

interface V3UserContextType {
  owner: V3Owner | null
  isLoggedIn: boolean | null
  login: (owner: V3Owner, token: string) => void
  logout: () => Promise<void>
  setOwner: (owner: V3Owner) => void
}

const V3UserContext = createContext<V3UserContextType | undefined>(undefined)

export function V3UserProvider({ children }: { children: ReactNode }) {
  const [owner, setOwner_] = useState<V3Owner | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(V3_AUTH_TOKEN_KEY)
    if (!token) {
      setIsLoggedIn(false)
      return
    }
    const stored = localStorage.getItem(V3_OWNER_KEY)
    if (stored) {
      try {
        setOwner_(JSON.parse(stored))
        setIsLoggedIn(true)
      } catch {
        clearV3Auth()
        setIsLoggedIn(false)
      }
    } else {
      clearV3Auth()
      setIsLoggedIn(false)
    }
  }, [])

  const login = useCallback((owner: V3Owner, token: string) => {
    setV3AuthToken(token)
    localStorage.setItem(V3_OWNER_KEY, JSON.stringify(owner))
    setOwner_(owner)
    setIsLoggedIn(true)
  }, [])

  const setOwner = useCallback((updated: V3Owner) => {
    localStorage.setItem(V3_OWNER_KEY, JSON.stringify(updated))
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
    <V3UserContext.Provider value={{ owner, isLoggedIn, login, logout, setOwner }}>
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
