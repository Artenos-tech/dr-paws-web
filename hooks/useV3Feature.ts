export function useV3Feature(): boolean {
  return process.env.NEXT_PUBLIC_V3_ENABLED === "true"
}
