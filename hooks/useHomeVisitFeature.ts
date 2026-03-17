import { useEffect } from "react"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"

export function useHomeVisitFeature() {
  const {
    call: getHomeVisitFeatureFlag,
    loading,
    result,
  } = useAPICall(atHomeApiClient.getHomeVisitFeatureFlag)

  useEffect(() => {
    getHomeVisitFeatureFlag({})
  }, [])

  return {
    isFeatureEnabled:
      result?.ok === true && result.value.body.enableHomeVisits === true,
    isLoading: loading,
  }
}
