export type AddressApi = {
  id: string
  tag: string
  location: { lat: number; long: number }
  address_line1: string
  address_line2: string
  directions?: string | null
  pincode?: number
}

export type AddressFormValues = {
  tag: string
  addressLine1: string
  addressLine2: string
  directions: string | null
}
