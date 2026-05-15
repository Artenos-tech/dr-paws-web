"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ClipLoader from "react-spinners/ClipLoader"
import { useV3UserContext } from "@/context/V3UserContext"
import { useV3Feature } from "@/hooks/useV3Feature"

export default function V3Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useV3UserContext()
  const isV3Enabled = useV3Feature()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push("/v3/login")
    }
    if (isV3Enabled === false) {
      router.replace("/")
    }
  }, [isLoggedIn, isV3Enabled])

  if (
    isLoggedIn === null ||
    isLoggedIn === false ||
    isV3Enabled === null ||
    isV3Enabled === false
  ) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return <>{children}</>
}
