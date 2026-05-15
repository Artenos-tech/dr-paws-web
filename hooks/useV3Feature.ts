import { useAppConfig } from "@/context/AppConfigContext"

export function useV3Feature(): boolean | null {
  return useAppConfig().v3Enabled
}
