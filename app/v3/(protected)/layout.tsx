"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ClipLoader from "react-spinners/ClipLoader"
import { useV3UserContext } from "@/context/V3UserContext"
export default function V3Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useV3UserContext()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push("/v3/login")
    }
  }, [isLoggedIn])

  if (isLoggedIn === null || isLoggedIn === false) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return <>{children}</>
}
