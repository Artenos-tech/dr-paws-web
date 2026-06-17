"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

if (typeof window !== "undefined") {
  posthog.init("phc_BBUYXF9xmi4t6TTR4DZT7Fo3ZewHKxcqFw8hYtDveY3Y", {
    api_host: "https://us.i.posthog.com",
    defaults: "2026-05-30",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  })
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.location.origin + pathname
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`
      }
      posthog.capture("$pageview", { $current_url: url })
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
