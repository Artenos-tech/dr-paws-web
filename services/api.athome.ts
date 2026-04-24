import { createAPIClient, z, type APIResponse } from "../lib/apiclient"
import { type Result, ok, err } from "../lib/result"

export {
  FetchAPIError,
  ParseAPIError,
  SchemaAPIError,
  ErrorResponseAPIError,
} from "../lib/apiclient"

import {
  AUTH_TOKEN_HEADER_NAME,
  AUTH_TOKEN_LOCALSTORAGE_KEY,
  requestContext,
} from "./api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

// ============================================================================
// SCHEMAS
// ============================================================================

const AddressSchema = z.object({
  id: z.string().uuid(),
  tag: z.string(),
  location: z
    .object({
      lat: z.number(),
      long: z.number(),
    })
    .nullable(),
  address_line1: z.string(),
  address_line2: z.string(),
  pincode: z.string(),
  directions: z.string().optional(),
  has_coordinates: z.boolean(),
})

const BookingTypeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  displayOrder: z.number(),
  type: z.enum(["HOME_VISIT", "CLINIC_VISIT"]),
})

const PetSchema = z.object({
  id: z.string(),
  name: z.string(),
  profile_image: z.string().nullable(),
  type: z.enum(["DOG", "CAT", "OTHER"]),
  serviceable: z.boolean(),
})

const SlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  available: z.boolean(),
})

const DayWithSlotsSchema = z.object({
  date: z.string(),
  slots: z.array(SlotSchema),
})

const PaymentOrderSchema = z.object({
  orderId: z.string(),
  paymentSessionId: z.string(),
})

const HomeVisitPricingSchema = z.object({
  base_amount: z.number(),
  discount_amount: z.number(),
  final_amount: z.number(),
  coupon_applied: z.boolean(),
  coupon_code: z.string().nullable(),
})

const OrderStatusSchema = z.object({
  success: z.boolean(),
  status: z.enum([
    "ACTIVE",
    "PAID",
    "EXPIRED",
    "TERMINATED",
    "TERMINATION_REQUESTED",
  ]),
})

const AppointmentSchema = z.object({
  id: z.string().uuid(),
  sub_booking_id: z.string().uuid(),
  clinic_id: z.string().uuid(),
  pet_name: z.string(),
  pet_type: z.enum(["DOG", "CAT", "OTHER"]).nullable(),
  pet_profile_image: z.string().nullable(),
  booking_date: z.string(),
  appt_start: z.string(),
  appt_end: z.string(),
  booking_type: z.enum(["HOME_VISIT", "CLINIC_VISIT"]),
  appt_type_title: z.enum(["Vet Consultation", "Grooming", "Home Visit"]),
  appt_type: z.enum(["VET_CONSULTATION", "GROOMING", "HOME_VISIT"]), // home visits may have different sub types in the future; for now keeping this as is
  category: z.enum(["UPCOMING", "COMPLETED", "CANCELLED", "ACTIVE"]),
  catalogue_keys: z.array(z.string()).optional(),
  clinic_name: z.string().optional(),
  clinic_location: z.string().optional(),
  coupon_code: z.string().optional(),
  vet_name: z.string().nullable().optional(),
  vet_image: z.string().nullable().optional(),
  vet_contact: z.string().nullable().optional(),
  address: AddressSchema.optional(),
  visit_status: z
    .enum([
      "UNCONFIRMED",
      "VET_CONFIRMED",
      "VET_DELAYED",
      "VET_REACHED",
      "CANCELLED",
      "VISIT_STARTED",
      "VISIT_FINISHED",
    ])
    .optional(),
  helpline_no: z.string().optional(),
  start_otp: z.string().nullable().optional(),
  sos_status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

const RefundSchema = z.object({
  status: z.enum([
    "PENDING",
    "SUCCESS",
    "FAILED",
    "CANCELLED",
    "ONHOLD",
    "NOT_APPLICABLE",
  ]),
  id: z.string().uuid().nullable(),
  amount: z.number(),
})

const AppointmentDetailSchema = z
  .object({
    pet_id: z.string().uuid(),
    vet_id: z.string().uuid().nullable().optional(),
    clinic_contact: z.string(),
    invoice_id: z.string().uuid().nullable(),
    total_tax_amount: z.number(),
    total_billing_amount: z.number(),
    refund_preview_amount: z.number().optional(),
    payment_status: z.enum([
      "PAID",
      "UNPAID",
      "NO_BILL",
      "PARTIALLY_PAID",
      "OVERPAID",
    ]),
    refund: RefundSchema.optional(),
    reason_for_visit: z
      .enum([
        "VACCINATION",
        "CHECK_UP",
        "SICK",
        "DIAGNOSTICS",
        "FOLLOW_UP",
        "OTHER",
      ])
      .optional(),
    notes: z.string().optional(),
    sos_id: z.string().optional(),
    resolved_at: z.string().optional(),
    resolution_notes: z.string().optional(),
  })
  .merge(
    z.object({
      ...AppointmentSchema.shape,
    }),
  )

// ============================================================================
// TYPE DEFINITION
// ============================================================================

export type AtHomeAPIClient = {
  getHomeVisitFeatureFlag: (
    params: { platform: "web" | "ios" | "android" },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        enableHomeVisits: boolean
      }>,
      any
    >
  >

  // Address Book
  getAddressBook: (
    params: Record<string, never>,
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          address_book: Array<z.infer<typeof AddressSchema>>
        }
      }>,
      any
    >
  >

  getAddress: (
    params: { addressid: string },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          address: z.infer<typeof AddressSchema>
        }
      }>,
      any
    >
  >

  addAddress: (
    params: {
      address: {
        tag: string
        location: { lat: number; long: number }
        address_line1: string
        address_line2: string
        directions?: string
      }
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          address: { id: string }
        }
      }>,
      any
    >
  >

  updateAddress: (
    params: {
      addressid: string
      address: {
        tag: string
        location: { lat: number; long: number }
        address_line1: string
        address_line2: string
        directions?: string
      }
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          address: { id: string }
        }
      }>,
      any
    >
  >

  deleteAddress: (
    params: { addressid: string },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<Result<APIResponse<{ status: number; message: string }>, any>>

  // Booking
  getBookingTypes: (
    params: Record<string, never>,
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          bookingTypes: Array<z.infer<typeof BookingTypeSchema>>
        }
      }>,
      any
    >
  >

  getServiceablePincodes: (
    params: Record<string, never>,
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          pincodes: Array<string>
        }
      }>,
      any
    >
  >

  getEmergencyContact: (
    params: Record<string, never>,
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        emergencyPhone: string | null
      }>,
      any
    >
  >

  checkLocationServiceability: (
    params: { location: { lat: number; long: number } },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          serviceable: boolean
        }
      }>,
      any
    >
  >

  getBookingPets: (
    params: Record<string, never>,
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          pets: Array<z.infer<typeof PetSchema>>
        }
      }>,
      any
    >
  >

  getAtHomeSlots: (
    params: { addressid: string; petid: string },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          days: Array<z.infer<typeof DayWithSlotsSchema>>
        }
      }>,
      any
    >
  >

  getHomeVisitPaymentAmount: (
    params: {
      address_id: string
      pet_id: string
      appt_start: string
      appt_end: string
      booking_date: string
      coupon_code?: string
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          amount: number
          pricing: z.infer<typeof HomeVisitPricingSchema>
        }
      }>,
      any
    >
  >

  createPaymentOrder: (
    params: {
      pet_id: string
      appt_start: string
      appt_end: string
      booking_date: string
      address_id: string
      reason_for_visit:
        | "VACCINATION"
        | "CHECK_UP"
        | "SICK"
        | "DIAGNOSTICS"
        | "FOLLOW_UP"
        | "OTHER"
      notes: string
      coupon_code?: string
      booking_flow_session_id?: string
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          order: z.infer<typeof PaymentOrderSchema>
        }
      }>,
      any
    >
  >

  getOrderStatus: (
    params: { orderid: string },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          order_payment: z.infer<typeof OrderStatusSchema>
          appointment: {
            id: string
            sub_booking_id: string
          } | null
        }
      }>,
      any
    >
  >

  // Appointments
  getAppointmentsV2: (
    params: Record<string, never>,
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          appointments: Array<z.infer<typeof AppointmentSchema>>
        }
      }>,
      any
    >
  >

  getAppointmentDetails: (
    params: { appointment_id: string; sub_booking_id: string },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          appointment: z.infer<typeof AppointmentDetailSchema>
        }
      }>,
      any
    >
  >

  cancelAppointmentV2: (
    params: {
      appointment_id: string
      clinic_id: string
      sub_booking_id: string
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          appointment: {
            id: string
            refund?: z.infer<typeof RefundSchema>
          }
        }
      }>,
      any
    >
  >

  rescheduleAtHomeAppointment: (
    params: {
      appointment_id: string
      sub_booking_id: string
      booking_date: string
      appt_start: string
      appt_end: string
      vet_id?: string
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          appointment_id: string
        }
      }>,
      any
    >
  >

  raiseSOSAlert: (
    params: {
      appointment_id: string
      sub_booking_id: string
      description?: string
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          appointment_id: string
          sos_id: string
        }
      }>,
      any
    >
  >

  cancelSOSAlert: (
    params: {
      appointment_id: string
      sub_booking_id: string
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          appointment_id: string
        }
      }>,
      any
    >
  >

  getSOSStatus: (
    params: {
      appointment_id: string
      sub_booking_id: string
      sos_id: string
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        data: {
          sos_status: "ACTIVE" | "INACTIVE"
          resolved_at?: string
          resolution_notes?: string
        }
      }>,
      any
    >
  >
}

// ============================================================================
// MOCK IMPLEMENTATION
// ============================================================================

// Mock data generators
const generateUUID = () => crypto.randomUUID()

const mockAddresses: Array<z.infer<typeof AddressSchema>> = [
  {
    id: generateUUID(),
    tag: "Home",
    location: { lat: 12.9352, long: 77.6245 },
    address_line1: "123 Main Street",
    address_line2: "Koramangala 4th Block",
    pincode: "560034",
    directions: "Near Sony Signal",
    has_coordinates: true,
  },
  {
    id: generateUUID(),
    tag: "Office",
    location: { lat: 12.9716, long: 77.5946 },
    address_line1: "456 Park Avenue",
    address_line2: "Indiranagar 100 Feet Road",
    pincode: "560038",
    has_coordinates: true,
  },
  {
    id: generateUUID(),
    tag: "Parent's Place",
    location: { lat: 12.9698, long: 77.7499 },
    address_line1: "789 Garden Road",
    address_line2: "Whitefield Main Road",
    pincode: "560066",
    directions: "Opposite Forum Mall",
    has_coordinates: true,
  },
]

const mockPets = [
  {
    id: generateUUID(),
    name: "Max",
    profile_image: "https://example.com/max.jpg",
    type: "DOG" as const,
    serviceable: true,
  },
  {
    id: generateUUID(),
    name: "Bella",
    profile_image: "https://example.com/bella.jpg",
    type: "CAT" as const,
    serviceable: true,
  },
  {
    id: generateUUID(),
    name: "Charlie",
    profile_image: null,
    type: "OTHER" as const,
    serviceable: false,
  },
]

const mockBookingTypes: Array<z.infer<typeof BookingTypeSchema>> = [
  {
    id: "1",
    title: "Home Visit",
    description: "One of our vets comes to you",
    image: "https://example.com/home-visit.jpg",
    displayOrder: 1,
    type: "HOME_VISIT",
  },
  {
    id: "2",
    title: "Dr. Paws Clinics",
    description: "Visit one of our awesome clinics",
    image: "https://example.com/clinic.jpg",
    displayOrder: 2,
    type: "CLINIC_VISIT",
  },
]

const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve) => {
    // If already aborted, resolve immediately
    if (signal?.aborted) {
      return resolve()
    }

    const timeout = setTimeout(() => resolve(), ms)

    // When aborted, clear timeout and resolve immediately
    const onAbort = () => {
      clearTimeout(timeout)
      resolve()
    }

    signal?.addEventListener("abort", onAbort, { once: true })
  })

export const mockAtHomeClient: AtHomeAPIClient = {
  getHomeVisitFeatureFlag: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Home visit feature flag fetched successfully",
        enableHomeVisits: true,
      },
    })
  },
  getAddressBook: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "User address book fetched successfully",
        data: {
          address_book: mockAddresses,
        },
      },
    })
  },

  getAddress: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    const address = mockAddresses.find((a) => a.id === params.addressid)
    if (!address) {
      return err({
        apiClientError: true,
        apiClientErrorType: "ErrorResponseAPIError",
        message: "Address not found",
        status: 404,
        body: { status: 404, message: "Address not found" },
      } as any)
    }
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Address fetched successfully",
        data: {
          address: address,
        },
      },
    })
  },

  addAddress: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    const newId = generateUUID()
    const newAddress: z.infer<typeof AddressSchema> = {
      id: newId,
      tag: params.address.tag,
      location: params.address.location,
      address_line1: params.address.address_line1,
      address_line2: params.address.address_line2,
      pincode: "560000", // Default pincode for mock
      directions: params.address.directions ?? undefined,
      has_coordinates: true,
    }

    mockAddresses.push(newAddress)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "New address added to address book successfully",
        data: {
          address: { id: newId },
        },
      },
    })
  },

  updateAddress: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    const address = mockAddresses.find((a) => a.id === params.addressid)
    if (!address) {
      return err({
        apiClientError: true,
        apiClientErrorType: "ErrorResponseAPIError",
        message: "Address not found",
        status: 404,
        body: { status: 404, message: "Address not found" },
      } as any)
    }

    Object.assign(address, params.address)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Address updated successfully",
        data: {
          address: { id: params.addressid },
        },
      },
    })
  },

  deleteAddress: async (params, opts) => {
    await delay(500, opts?.abortSignal)

    const index = mockAddresses.findIndex((a) => a.id === params.addressid)
    if (index === -1) {
      return err({
        apiClientError: true,
        apiClientErrorType: "ErrorResponseAPIError",
        message: "Address not found",
        status: 404,
        body: { status: 404, message: "Address not found" },
      } as any)
    }

    mockAddresses.splice(index, 1)

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Address deleted from address book successfully",
      },
    })
  },

  getBookingTypes: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Booking types fetched successfully",
        data: {
          bookingTypes: mockBookingTypes,
        },
      },
    })
  },

  getServiceablePincodes: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Serviceable pincodes fetched successfully",
        data: {
          pincodes: ["560034", "560038", "560066", "560095", "560100"],
        },
      },
    })
  },

  getEmergencyContact: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Emergency contact fetched successfully",
        emergencyPhone: "1234567899",
      },
    })
  },

  checkLocationServiceability: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    const { lat, long: lng } = params.location
    const serviceable = lat >= 12.8 && lat <= 13.1 && lng >= 77.5 && lng <= 77.8

    // 10% chance of returning not serviceable for testing
    const randomFail = Math.random() < 0.1

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Location serviceability checked successfully",
        data: {
          serviceable: serviceable && !randomFail,
        },
      },
    })
  },

  getBookingPets: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "User pets fetched successfully",
        data: {
          pets: mockPets,
        },
      },
    })
  },

  getAtHomeSlots: async (params, opts) => {
    await delay(500, opts?.abortSignal)

    // Generate slots for next 5 days
    const days = []
    const today = new Date()

    const slots1 = [
      { startTime: "09:00", endTime: "10:00", available: true },
      { startTime: "10:00", endTime: "11:00", available: false },
      { startTime: "11:00", endTime: "12:00", available: true },
      { startTime: "12:00", endTime: "13:00", available: false },
      { startTime: "13:00", endTime: "14:00", available: false },
      { startTime: "14:00", endTime: "15:00", available: true },
      { startTime: "15:00", endTime: "16:00", available: false },
      { startTime: "16:00", endTime: "17:00", available: true },
      { startTime: "17:00", endTime: "18:00", available: false },
      { startTime: "18:00", endTime: "19:00", available: true },
      { startTime: "19:00", endTime: "20:00", available: false },
      { startTime: "20:00", endTime: "21:00", available: false },
    ]

    const slots2 = [
      { startTime: "09:00", endTime: "10:00", available: true },
      { startTime: "10:00", endTime: "11:00", available: true },
      { startTime: "11:00", endTime: "12:00", available: true },
      { startTime: "12:00", endTime: "13:00", available: false },
      { startTime: "13:00", endTime: "14:00", available: false },
      { startTime: "14:00", endTime: "15:00", available: false },
      { startTime: "15:00", endTime: "16:00", available: false },
      { startTime: "16:00", endTime: "17:00", available: true },
      { startTime: "17:00", endTime: "18:00", available: true },
      { startTime: "18:00", endTime: "19:00", available: true },
      { startTime: "19:00", endTime: "20:00", available: false },
      { startTime: "20:00", endTime: "21:00", available: false },
    ]

    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      i === 0
        ? days.push({ date: dateStr, slots: [] })
        : i % 2 === 0
          ? days.push({ date: dateStr, slots: slots1 })
          : days.push({ date: dateStr, slots: slots2 })
    }

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Slots for staff fetched successfully",
        data: {
          days,
        },
      },
    })
  },

  getHomeVisitPaymentAmount: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    const couponCode = params.coupon_code?.trim().toUpperCase()
    const baseAmount = 799
    const discountAmount = couponCode === "HOME400" ? 400 : 0
    const finalAmount = baseAmount - discountAmount
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Fetched home visit payment amount successfully",
        data: {
          amount: finalAmount,
          pricing: {
            base_amount: baseAmount,
            discount_amount: discountAmount,
            final_amount: finalAmount,
            coupon_applied: discountAmount > 0,
            coupon_code: discountAmount > 0 ? (couponCode ?? null) : null,
          },
        },
      },
    })
  },

  createPaymentOrder: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Payment order created successfully",
        data: {
          order: {
            orderId: generateUUID(),
            paymentSessionId: `session_${generateUUID()}`,
          },
        },
      },
    })
  },

  getOrderStatus: async (params, opts) => {
    await delay(500, opts?.abortSignal)

    // 10% chance of payment failure for testing
    const paymentFailed = Math.random() < 0.1

    const appointment = paymentFailed
      ? null
      : {
          id: generateUUID(),
          sub_booking_id: generateUUID(),
          pet_name: mockPets[0].name,
          pet_type: mockPets[0].type,
          pet_profile_image: mockPets[0].profile_image,
          clinic_id: generateUUID(),
          booking_date: new Date().toISOString().split("T")[0],
          appt_start: "10:00",
          appt_end: "11:00",
          appt_type_title: "Home Visit" as const,
          appt_type: "HOME_VISIT" as const,
          address: mockAddresses[0],
          sos_status: "INACTIVE" as const,
        }

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Order status fetched successfully",
        data: {
          order_payment: {
            success: !paymentFailed,
            status: paymentFailed ? ("EXPIRED" as const) : ("PAID" as const),
          },
          appointment,
        },
      },
    })
  },

  getAppointmentsV2: async (params, opts) => {
    await delay(500, opts?.abortSignal)

    const appointments = [
      {
        id: generateUUID(),
        sub_booking_id: generateUUID(),
        clinic_id: generateUUID(),
        pet_name: mockPets[0].name,
        pet_type: mockPets[0].type,
        pet_profile_image: null,
        booking_date: "2025-01-15",
        appt_start: "10:00",
        appt_end: "11:00",
        booking_type: "HOME_VISIT" as const,
        appt_type_title: "Home Visit" as const,
        appt_type: "HOME_VISIT" as const,
        category: "UPCOMING" as const,
        vet_name: "Dr. Sharma",
        vet_image: null,
        vet_contact: "+91-9876543210",
        address: mockAddresses[0],
        visit_status: "VET_CONFIRMED" as const,
        helpline_no: "+91-1800-DRPAWS",
        start_otp: "123456",
        sos_status: "INACTIVE" as const,
      },
      {
        id: generateUUID(),
        sub_booking_id: generateUUID(),
        clinic_id: generateUUID(),
        pet_name: mockPets[1].name,
        pet_type: mockPets[1].type,
        pet_profile_image: null,
        booking_date: "2024-12-10",
        appt_start: "14:00",
        appt_end: "15:00",
        booking_type: "CLINIC_VISIT" as const,
        appt_type_title: "Vet Consultation" as const,
        appt_type: "VET_CONSULTATION" as const,
        category: "COMPLETED" as const,
        clinic_name: "PetCare Bangalore",
        clinic_location: "Koramangala, Bangalore",
        clinic_contact: "+91-9876543211",
        vet_name: "Dr. Patel",
        vet_image: null,
        coupon_code: "FIRST50",
      },
      {
        id: generateUUID(),
        sub_booking_id: generateUUID(),
        clinic_id: generateUUID(),
        pet_name: mockPets[0].name,
        pet_type: mockPets[0].type,
        pet_profile_image: null,
        booking_date: "2025-01-16",
        appt_start: "11:00",
        appt_end: "12:00",
        booking_type: "HOME_VISIT" as const,
        appt_type_title: "Home Visit" as const,
        appt_type: "HOME_VISIT" as const,
        category: "UPCOMING" as const,
        vet_name: null,
        vet_image: null,
        vet_contact: null,
        address: mockAddresses[0],
        visit_status: "UNCONFIRMED" as const,
        helpline_no: "+91-1800-DRPAWS",
        start_otp: "123456",
        sos_status: "INACTIVE" as const,
      },
      {
        id: generateUUID(),
        sub_booking_id: generateUUID(),
        clinic_id: generateUUID(),
        pet_name: mockPets[0].name,
        pet_type: mockPets[0].type,
        pet_profile_image: null,
        booking_date: "2025-01-10",
        appt_start: "11:00",
        appt_end: "12:00",
        booking_type: "HOME_VISIT" as const,
        appt_type_title: "Home Visit" as const,
        appt_type: "HOME_VISIT" as const,
        category: "CANCELLED" as const,
        vet_name: null,
        vet_image: null,
        vet_contact: null,
        address: mockAddresses[0],
        visit_status: "CANCELLED" as const,
        helpline_no: "+91-1800-DRPAWS",
        start_otp: "123456",
        sos_status: "INACTIVE" as const,
      },
    ]
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Appointments fetched successfully",
        data: {
          appointments,
        },
      },
    })
  },

  getAppointmentDetails: async (params, opts) => {
    await delay(500, opts?.abortSignal)

    const appointment = {
      id: params.appointment_id,
      sub_booking_id: params.sub_booking_id,
      clinic_id: generateUUID(),
      clinic_contact: "+91-9876543210",
      pet_id: generateUUID(),
      pet_name: mockPets[0].name,
      pet_type: mockPets[0].type,
      pet_profile_image: null,
      booking_date: "2025-01-15",
      appt_start: "10:00",
      appt_end: "11:00",
      booking_type: "HOME_VISIT" as const,
      appt_type_title: "Home Visit" as const,
      appt_type: "HOME_VISIT" as const,
      category: "UPCOMING" as const,
      invoice_id: null,
      total_tax_amount: 0,
      total_billing_amount: 500,
      payment_status: "PAID" as const,
      vet_name: "Dr. Sharma",
      vet_image: null,
      vet_contact: "+91-9876543210",
      address: mockAddresses[0],
      visit_status: "VET_CONFIRMED" as const,
      helpline_no: "+91-1800-DRPAWS",
      start_otp: "123456",
      refund: {
        id: null,
        amount: 0,
        status: "NOT_APPLICABLE" as const,
      },
      sos_status: "INACTIVE" as const,
      reason_for_visit: "CHECK_UP" as const,
      notes: "my pet need check up",
    }

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Appointment details fetched successfully",
        data: {
          appointment,
        },
      },
    })
  },

  cancelAppointmentV2: async (params, opts) => {
    await delay(500, opts?.abortSignal)

    // 20% chance of refund being processed for testing
    const hasRefund = Math.random() < 0.8

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Appointment cancelled successfully",
        data: {
          appointment: {
            id: params.appointment_id,
            refund: hasRefund
              ? { status: "PENDING" as const, id: generateUUID(), amount: 500 }
              : undefined,
          },
        },
      },
    })
  },

  rescheduleAtHomeAppointment: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Appointment rescheduled successfully",
        data: {
          appointment_id: params.appointment_id,
        },
      },
    })
  },

  raiseSOSAlert: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "SOS Alert raised for appointment successfully",
        data: {
          appointment_id: params.appointment_id,
          sos_id: generateUUID(),
        },
      },
    })
  },

  cancelSOSAlert: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "SOS Alert cancelled for appointment successfully",
        data: {
          appointment_id: params.appointment_id,
        },
      },
    })
  },

  getSOSStatus: async (params, opts) => {
    await delay(500, opts?.abortSignal)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "SOS status fetched successfully",
        data: {
          sos_status: "ACTIVE" as const,
        },
      },
    })
  },
}

// ============================================================================
// REAL IMPLEMENTATION
// ============================================================================

const endpointConfig = {
  getHomeVisitFeatureFlag: {
    method: "GET" as const,
    path: "/config/home-visit-feature-flag?platform={platform}",
    pathParamsSchema: z.object({
      platform: z.enum(["web", "ios", "android"]),
    }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      status: z.number(),
      message: z.string(),
      enableHomeVisits: z.boolean(),
    }),
    errorResponseSchema: z.object({}),
  },
  // Address Book
  getAddressBook: {
    method: "GET" as const,
    path: "/user/address-book",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        address_book: z.array(AddressSchema),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  getAddress: {
    method: "GET" as const,
    path: "/user/address-book/{addressid}",
    pathParamsSchema: z.object({ addressid: z.string().uuid() }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        address: AddressSchema,
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  addAddress: {
    method: "POST" as const,
    path: "/user/address-book",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({
      address: z.object({
        tag: z.string(),
        location: z.object({
          lat: z.number(),
          long: z.number(),
        }),
        address_line1: z.string(),
        address_line2: z.string(),
        directions: z.string().nullable(),
      }),
    }),
    responseSchema: z.object({
      data: z.object({
        address: z.object({
          id: z.string().uuid(),
        }),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  updateAddress: {
    method: "PUT" as const,
    path: "/user/address-book/{addressid}",
    pathParamsSchema: z.object({ addressid: z.string().uuid() }),
    requestSchema: z.object({
      address: z.object({
        tag: z.string(),
        location: z.object({
          lat: z.number(),
          long: z.number(),
        }),
        address_line1: z.string(),
        address_line2: z.string(),
        pincode: z.number(),
        directions: z.string().nullable(),
      }),
    }),
    responseSchema: z.object({
      data: z.object({
        address: z.object({
          id: z.string().uuid(),
        }),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  deleteAddress: {
    method: "DELETE" as const,
    path: "/user/address-book/{addressid}",
    pathParamsSchema: z.object({ addressid: z.string().uuid() }),
    requestSchema: z.object({}),
    responseSchema: z.object({}),
    errorResponseSchema: z.object({}),
  },

  // Booking
  getBookingTypes: {
    method: "GET" as const,
    path: "/booking/types",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        bookingTypes: z.array(BookingTypeSchema),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  getServiceablePincodes: {
    method: "GET" as const,
    path: "/at-home/location/serviceable-pincodes",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        pincodes: z.array(z.string()),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  getEmergencyContact: {
    method: "GET" as const,
    path: "/config/emergency-contact",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({}),
    responseSchema: z.object({
      emergencyPhone: z.string().nullable(),
    }),
    errorResponseSchema: z.object({}),
  },

  checkLocationServiceability: {
    method: "POST" as const,
    path: "/at-home/location/serviceability",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({
      location: z.object({
        lat: z.number(),
        long: z.number(),
      }),
    }),
    responseSchema: z.object({
      data: z.object({
        serviceable: z.boolean(),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  getBookingPets: {
    method: "GET" as const,
    path: "/booking/pets",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        pets: z.array(PetSchema),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  getAtHomeSlots: {
    method: "GET" as const,
    path: "/booking/at-home/slots?addressid={addressid}&petid={petid}",
    pathParamsSchema: z.object({
      addressid: z.string().uuid(),
      petid: z.string(),
    }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        days: z.array(DayWithSlotsSchema),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  getHomeVisitPaymentAmount: {
    method: "GET" as const,
    path: "/booking/at-home/payments/amount/{address_id}?pet_id={pet_id}&booking_date={booking_date}&appt_start={appt_start}&appt_end={appt_end}&coupon_code={coupon_code}",
    pathParamsSchema: z.object({
      address_id: z.string(),
      pet_id: z.string(),
      booking_date: z.string(),
      appt_start: z.string(),
      appt_end: z.string(),
      coupon_code: z.string().optional(),
    }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        amount: z.number(),
        pricing: HomeVisitPricingSchema,
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  createPaymentOrder: {
    method: "POST" as const,
    path: "/booking/at-home/payments/orders",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({
      pet_id: z.string(),
      appt_start: z.string(),
      appt_end: z.string(),
      booking_date: z.string(),
      address_id: z.string(),
      reason_for_visit: z.enum([
        "VACCINATION",
        "CHECK_UP",
        "SICK",
        "DIAGNOSTICS",
        "FOLLOW_UP",
        "OTHER",
      ]),
      notes: z.string(),
      coupon_code: z.string().optional(),
      booking_flow_session_id: z.string().uuid().optional(),
    }),
    responseSchema: z.object({
      data: z.object({
        order: PaymentOrderSchema,
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  getOrderStatus: {
    method: "GET" as const,
    path: "/booking/at-home/order/{orderid}/status",
    pathParamsSchema: z.object({ orderid: z.string().uuid() }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        order_payment: OrderStatusSchema,
        appointment: z
          .object({
            id: z.string(),
            sub_booking_id: z.string(),
          })
          .nullable(),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  // Appointments
  getAppointmentsV2: {
    method: "GET" as const,
    path: "/user/appointments/v2",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        appointments: z.array(AppointmentSchema),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  getAppointmentDetails: {
    method: "GET" as const,
    path: "/user/appointment/{appointment_id}?sub_booking_id={sub_booking_id}",
    pathParamsSchema: z.object({
      appointment_id: z.string().uuid(),
      sub_booking_id: z.string().uuid(),
    }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        appointment: AppointmentDetailSchema,
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  cancelAppointmentV2: {
    method: "PUT" as const,
    path: "/user/appointment/{appointment_id}/cancel/v2",
    pathParamsSchema: z.object({ appointment_id: z.string().uuid() }),
    requestSchema: z.object({
      clinic_id: z.string().uuid(),
      sub_booking_id: z.string().uuid(),
    }),
    responseSchema: z.object({
      data: z.object({
        appointment: z.object({
          id: z.string().uuid(),
          refund: RefundSchema.optional(),
        }),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  rescheduleAtHomeAppointment: {
    method: "PUT" as const,
    path: "/user/appointment/{appointment_id}/reschedule/at-home",
    pathParamsSchema: z.object({ appointment_id: z.string().uuid() }),
    requestSchema: z.object({
      sub_booking_id: z.string().uuid(),
      booking_date: z.string(),
      appt_start: z.string(),
      appt_end: z.string(),
      vet_id: z.string().uuid().optional(),
    }),
    responseSchema: z.object({
      data: z.object({
        appointment_id: z.string().uuid(),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  raiseSOSAlert: {
    method: "PUT" as const,
    path: "/user/appointment/{appointment_id}/sos/alert?sub_booking_id={sub_booking_id}",
    pathParamsSchema: z.object({
      appointment_id: z.string().uuid(),
      sub_booking_id: z.string().uuid(),
    }),
    requestSchema: z.object({
      description: z.string().optional(),
    }),
    responseSchema: z.object({
      data: z.object({
        appointment_id: z.string().uuid(),
        sos_id: z.string().uuid(),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  cancelSOSAlert: {
    method: "PUT" as const,
    path: "/user/appointment/{appointment_id}/sos/cancel?sub_booking_id={sub_booking_id}",
    pathParamsSchema: z.object({
      appointment_id: z.string().uuid(),
      sub_booking_id: z.string().uuid(),
    }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        appointment_id: z.string().uuid(),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  getSOSStatus: {
    method: "GET" as const,
    path: "/user/appointment/{appointment_id}/sos/{sos_id}/status?sub_booking_id={sub_booking_id}",
    pathParamsSchema: z.object({
      appointment_id: z.string().uuid(),
      sub_booking_id: z.string().uuid(),
      sos_id: z.string(),
    }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      data: z.object({
        sos_status: z.enum(["ACTIVE", "INACTIVE"]),
        resolved_at: z.string().optional(),
        resolution_notes: z.string().optional(),
      }),
    }),
    errorResponseSchema: z.object({}),
  },
}

export const realAtHomeClient = createAPIClient({
  baseUrl: API_BASE_URL,
  baseResponseSchema: z.object({
    status: z.number(),
    message: z.string(),
  }),
  requestContext,
  endpointConfig,
}) as AtHomeAPIClient

// ============================================================================
// EXPORT (switches based on environment variable)
// ============================================================================

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_ATHOME === "true"

export default USE_MOCK ? mockAtHomeClient : realAtHomeClient
