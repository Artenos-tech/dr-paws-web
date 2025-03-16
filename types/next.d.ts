import type { ImageLoaderProps } from "next/image"

declare module "next/image" {
  export function unstable_getImgProps(props: ImageLoaderProps): {
    props: ImageLoaderProps
  }
}
