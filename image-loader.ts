export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width?: number
  quality?: number
}): string {
  if (process.env.NEXT_EXPORT === "true") {
    // Handle Next.js optimized images
    if (src.startsWith("/_next/static/media/")) {
      return src
    }

    // Remove the leading slash if present
    const cleanSrc = src.startsWith("/") ? src.slice(1) : src

    // Check if the path already includes 'assets/optimized-images'
    if (cleanSrc.includes("assets/optimized-images")) {
      return `/${cleanSrc}`
    }

    // Otherwise, construct the path to the optimized image
    const parts = cleanSrc.split("/")
    const filename = parts[parts.length - 1]
    return `/assets/optimized-images/${filename}`
  } else {
    // Logic for dynamic builds (using Next.js built-in loader)
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${
      quality || 75
    }`
  }
}
