"use client"

import { createContext, ReactNode, useContext } from "react"

interface AppConfigContextType {
  // Whether bookings require online payment up-front. The Dr Paws API books
  // appointments directly (payment is collected at the clinic), so these are
  // always false; the flags are kept so booking screens can show the right copy.
  clinicVisitPaymentsEnabled: boolean | null
  homeVisitPaymentsEnabled: boolean | null
}

const config: AppConfigContextType = {
  clinicVisitPaymentsEnabled: false,
  homeVisitPaymentsEnabled: false,
}

const AppConfigContext = createContext<AppConfigContextType>(config)

export function AppConfigProvider({ children }: { children: ReactNode }) {
  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  )
}

export function useAppConfig(): AppConfigContextType {
  return useContext(AppConfigContext)
}
