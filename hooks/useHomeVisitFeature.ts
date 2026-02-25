import { useState, useEffect } from "react"

export function useHomeVisitFeature() {
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false)

  useEffect(() => {
    setIsFeatureEnabled(process.env.NEXT_PUBLIC_HOME_VISIT_ENABLED === "true")
  }, [])

  return isFeatureEnabled
}
