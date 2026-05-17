/**
 * Wraps all authenticated routes.
 */

"use client"

import { usePathname, useRouter } from "next/navigation"
// import toast from "react-hot-toast"
import { useUserContext } from "@/context/UserContext"
import { useV3Feature } from "@/hooks/useV3Feature"
import ClipLoader from "react-spinners/ClipLoader"
import { useEffect, useState } from "react"

export default function UserLayout(props: { children: React.ReactNode }) {
  const { isLoggedIn } = useUserContext()
  const pathname = usePathname()
  const router = useRouter()
  const isV3Enabled = useV3Feature()
  const [wasLoggedIn, setWasLoggedIn] = useState(false)

  useEffect(() => {
    if (isV3Enabled === true) {
      router.replace("/")
    }
  }, [isV3Enabled])

  useEffect(() => {
    if (isLoggedIn) {
      setWasLoggedIn(true)
    } else if (wasLoggedIn && isLoggedIn === false) {
      // toast.error("You've been logged out automatically. Please login again.")
      setWasLoggedIn(false)
    } else if (isLoggedIn === false) {
      // const loginText = pathname.match("book-appointment")
      //   ? "book a visit"
      //   : pathname.match("my-appointments")
      //     ? "view your appointments"
      //     : "continue"
      // initiateLogin(loginText, pathname)
      router.replace("/")
    }
  }, [isLoggedIn, pathname])

  if (isV3Enabled === null || isLoggedIn === null) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  if (isV3Enabled === true || isLoggedIn === false) {
    return null
  }
  return props.children
}
