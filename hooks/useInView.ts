import { useEffect, useRef, useState } from "react"

/**
 * Reports whether an element has scrolled into view, so data can be fetched
 * just in time instead of on mount.
 *
 * ```tsx
 * const [ref, inView] = useInView<HTMLDivElement>()
 * useEffect(() => { if (inView) load() }, [inView])
 * return <div ref={ref}>…</div>
 * ```
 *
 * Without IntersectionObserver (very old browsers / SSR) it reports `true`
 * on the client so content still loads.
 */
export function useInView<T extends Element = HTMLDivElement>(opts?: {
  /** Start loading slightly before the element is visible. Default "100px". */
  rootMargin?: string
  /** Stay `true` once seen. Default true. */
  once?: boolean
}) {
  const { rootMargin = "100px", once = true } = opts ?? {}
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting)
        if (visible) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, once])

  return [ref, inView] as const
}
