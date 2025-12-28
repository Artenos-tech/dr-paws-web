import {
  createAPIClient,
  RequestContext,
  z,
  type APIResponse,
} from "../lib/apiclient"
import { type Result, ok, err } from "../lib/result"

export {
  FetchAPIError,
  ParseAPIError,
  SchemaAPIError,
  ErrorResponseAPIError,
} from "../lib/apiclient"

import { AUTH_TOKEN_HEADER_NAME, AUTH_TOKEN_LOCALSTORAGE_KEY } from "./api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

function initRequestContext() {
  const ctx = new RequestContext()
  if (typeof window !== "undefined") {
    const authToken = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
    if (authToken) {
      ctx.addHeader(AUTH_TOKEN_HEADER_NAME, authToken)
    }
  }
  return ctx
}

const requestContext = initRequestContext()

// ============================================================================
// SCHEMAS
// ============================================================================

const AddressSchema = z.object({
  id: z.string().uuid(),
  tag: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  address_line1: z.string(),
  address_line2: z.string(),
  directions: z.string().nullable(),
})

const BookingTypeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  displayOrder: z.number(),
})

const PetSchema = z.object({
  id: z.string(),
  name: z.string(),
  profile_image: z.string().nullable(),
})

const SlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
})

const DayWithSlotsSchema = z.object({
  date: z.string(),
  slots: z.array(SlotSchema),
})

const PaymentOrderSchema = z.object({
  orderId: z.string(),
  paymentSessionId: z.string(),
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

const AppointmentAddressSchema = z.object({
  id: z.string().uuid(),
  tag: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  address_line1: z.string(),
  address_line2: z.string(),
  directions: z.string().nullable(),
})

const AppointmentSchema = z.object({
  id: z.string().uuid(),
  sub_booking_id: z.string().uuid(),
  pet_id: z.string().uuid(),
  pet_name: z.string(),
  pet_type: z.string().nullable(),
  pet_profile_image: z.string().nullable(),
  vet_id: z.string().uuid().nullable(),
  vet_name: z.string().nullable(),
  vet_image: z.string().url().nullable(),
  clinic_name: z.string().nullable(),
  booking_date: z.string(),
  appt_start: z.string(),
  appt_end: z.string(),
  appt_status: z.string(),
  appt_type: z.string(),
  appt_type_id: z.string().uuid(),
  category: z.enum(["UPCOMING", "COMPLETED", "REQUESTED", "CANCELLED"]),
  coupon_code: z.string().nullable().optional(),
})

const AppointmentDetailSchema = z.object({
  id: z.string().uuid(),
  sub_booking_id: z.string().uuid(),
  pet_id: z.string().uuid(),
  pet_name: z.string(),
  pet_type: z.string().nullable(),
  pet_profile_image: z.string().nullable(),
  vet_id: z.string().uuid().nullable(),
  vet_name: z.string().nullable(),
  vet_image: z.string().url().nullable(),
  vet_contact: z.string(),
  vet_status: z
    .enum([
      "UNCONFIRMED",
      "CONFIRMED",
      "DELAYED",
      "REACHED",
      "CANCELLED",
      "VISIT_STARTED",
      "VISIT_FINISHED",
    ])
    .nullable(),
  clinic_id: z.string().uuid().nullable(),
  clinic_name: z.string().nullable(),
  clinic_location: z.string().nullable(),
  clinic_contact: z.string(),
  booking_date: z.string(),
  appt_start: z.string(),
  appt_end: z.string(),
  appt_status: z.string(),
  appt_type: z.string(),
  appt_type_id: z.string().uuid(),
  category: z.enum(["UPCOMING", "COMPLETED", "REQUESTED", "CANCELLED"]),
  coupon_code: z.string().nullable().optional(),
  invoice_id: z.string().uuid().nullable(),
  total_tax_amount: z.number(),
  total_billing_amount: z.number(),
  payment_status: z.enum([
    "PAID",
    "UNPAID",
    "NO_BILL",
    "PARTIALLY_PAID",
    "OVERPAID",
  ]),
  address: AppointmentAddressSchema.optional(),
})

const RefundSchema = z.object({
  status: z.enum(["PENDING", "SUCCESS", "FAILED", "CANCELLED", "ONHOLD"]),
})

// ============================================================================
// TYPE DEFINITION
// ============================================================================

export type AtHomeAPIClient = {
  // Address Book
  getAddressBook: (
    params: Record<string, never>,
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        address_book: Array<z.infer<typeof AddressSchema>>
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
        address_book: z.infer<typeof AddressSchema>
      }>,
      any
    >
  >

  addAddress: (
    params: {
      address: {
        tag: string
        location: { lat: number; lng: number }
        address_line1: string
        address_line2: string
        directions: string | null
      }
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{ status: number; message: string; address: { id: string } }>,
      any
    >
  >

  updateAddress: (
    params: {
      addressid: string
      address: {
        tag: string
        location: { lat: number; lng: number }
        address_line1: string
        address_line2: string
        directions: string | null
      }
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{ status: number; message: string; address: { id: string } }>,
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
        bookingTypes: Array<z.infer<typeof BookingTypeSchema>>
      }>,
      any
    >
  >

  checkLocationServiceability: (
    params: { location: { lat: number; lng: number } },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{ status: number; message: string; serviceable: boolean }>,
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
        pets: Array<z.infer<typeof PetSchema>>
      }>,
      any
    >
  >

  getAtHomeSlots: (
    params: { clinicid: string },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        days: Array<z.infer<typeof DayWithSlotsSchema>>
      }>,
      any
    >
  >

  createPaymentOrder: (
    params: { amount: number },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        order: z.infer<typeof PaymentOrderSchema>
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
        order_payment: z.infer<typeof OrderStatusSchema>
      }>,
      any
    >
  >

  // Appointments
  createAtHomeAppointment: (
    params: {
      pet_id: string
      appt_start: string
      booking_date: string
      address_id: string
      reason_for_visit: "VACCINATION" | "CHECK-UP" | "SICK" | "OTHER"
      notes: string
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        appointment: {
          appt_type: string
          appt_start: string
          appt_end: string
          booking_date: string
          pet_name: string
          pet_type: "DOG" | "CAT"
          pet_profile_image: string | null
          address: z.infer<typeof AppointmentAddressSchema>
          clinic_contact: string
        }
      }>,
      any
    >
  >

  getAppointmentsV2: (
    params: Record<string, never>,
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        appointments: Array<z.infer<typeof AppointmentSchema>>
      }>,
      any
    >
  >

  getAppointmentDetailsV2: (
    params: { appointment_id: string },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        appointment: z.infer<typeof AppointmentDetailSchema>
      }>,
      any
    >
  >

  cancelAppointmentV2: (
    params: {
      appointmentid: string
      clinic_id: string
      sub_booking_id: string
    },
    opts?: { abortSignal?: AbortSignal },
  ) => Promise<
    Result<
      APIResponse<{
        status: number
        message: string
        appointment: {
          id: string
          clinic_id: string
          refund?: z.infer<typeof RefundSchema>
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

const mockAddresses = [
  {
    id: generateUUID(),
    tag: "Home",
    location: { lat: 12.9352, lng: 77.6245 }, // Koramangala
    address_line1: "123 Main Street",
    address_line2: "Koramangala 4th Block",
    directions: "Near Sony Signal",
  },
  {
    id: generateUUID(),
    tag: "Office",
    location: { lat: 12.9716, lng: 77.5946 }, // Indiranagar
    address_line1: "456 Park Avenue",
    address_line2: "Indiranagar 100 Feet Road",
    directions: null,
  },
  {
    id: generateUUID(),
    tag: "Parent's Place",
    location: { lat: 12.9698, lng: 77.7499 }, // Whitefield
    address_line1: "789 Garden Road",
    address_line2: "Whitefield Main Road",
    directions: "Opposite Forum Mall",
  },
  {
    id: generateUUID(),
    tag: "akshay's Place",
    location: { lat: 58.9698, lng: 25.7499 }, // Whitefield
    address_line1: "789 Garden Road ",
    address_line2: "Whitefield Main Road",
    directions: "Opposite Forum Mall",
  },
]

const mockPets = [
  {
    id: generateUUID(),
    name: "Max",
    profile_image: "https://example.com/max.jpg",
  },
  {
    id: generateUUID(),
    name: "Bella",
    profile_image: "https://example.com/bella.jpg",
  },
  { id: generateUUID(), name: "Charlie", profile_image: null },
]

const mockBookingTypes = [
  {
    id: "1",
    title: "Home Visit",
    description: "One of our vets comes to you",
    displayOrder: 1,
  },
  {
    id: "2",
    title: "Dr. Paws Clinics",
    description: "Visit one of our awesome clinics",
    displayOrder: 2,
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockAtHomeClient: AtHomeAPIClient = {
  getAddressBook: async (params, opts) => {
    await delay(500)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "User address book fetched successfully",
        address_book: mockAddresses,
      },
    })
  },

  getAddress: async (params, opts) => {
    await delay(500)
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
        address_book: address,
      },
    })
  },

  addAddress: async (params, opts) => {
    await delay(500)
    const newId = generateUUID()
    const newAddress = {
      id: newId,
      ...params.address,
    }

    mockAddresses.push(newAddress)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "New address added to address book successfully",
        address: { id: newId },
      },
    })
  },

  updateAddress: async (params, opts) => {
    await delay(500)
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
        message: "Address updated successfully",
        address: { id: params.addressid },
      },
    })
  },

  deleteAddress: async (params, opts) => {
    await delay(500)
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
        message: "Address deleted from address book successfully",
      },
    })
  },

  getBookingTypes: async (params, opts) => {
    await delay(500)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Booking types fetched successfully",
        bookingTypes: mockBookingTypes,
      },
    })
  },

  checkLocationServiceability: async (params, opts) => {
    await delay(500)
    // Mock: Bangalore area is serviceable (lat between 12.8-13.1, lng between 77.5-77.8)
    const { lat, lng } = params.location
    const serviceable = lat >= 12.8 && lat <= 13.1 && lng >= 77.5 && lng <= 77.8

    // 10% chance of returning not serviceable for testing
    const randomFail = Math.random() < 0.1

    return ok({
      status: 200,
      body: {
        status: 200,
        message:
          serviceable && !randomFail
            ? "Location is serviceable"
            : "Location is not serviceable",
        serviceable: serviceable && !randomFail,
      },
    })
  },

  getBookingPets: async (params, opts) => {
    await delay(500)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "User pets fetched successfully",
        pets: mockPets,
      },
    })
  },

  getAtHomeSlots: async (params, opts) => {
    await delay(500)

    // Generate slots for next 7 days
    const days = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]

      const slots = [
        { startTime: "09:00", endTime: "10:00" },
        { startTime: "11:00", endTime: "12:00" },
        { startTime: "14:00", endTime: "15:00" },
        { startTime: "16:00", endTime: "17:00" },
        { startTime: "18:00", endTime: "19:00" },
      ]

      days.push({ date: dateStr, slots })
    }

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Slots for staff fetched successfully",
        days,
      },
    })
  },

  createPaymentOrder: async (params, opts) => {
    await delay(500)
    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Payment order created successfully",
        order: {
          orderId: generateUUID(),
          paymentSessionId: `session_${generateUUID()}`,
        },
      },
    })
  },

  getOrderStatus: async (params, opts) => {
    await delay(500)

    // 10% chance of payment failure for testing
    const paymentFailed = Math.random() < 0.1

    return ok({
      status: 200,
      body: {
        status: 200,
        message: paymentFailed ? "Payment failed" : "Payment successful",
        order_payment: {
          success: !paymentFailed,
          status: paymentFailed ? "EXPIRED" : "PAID",
        },
      },
    })
  },

  createAtHomeAppointment: async (params, opts) => {
    await delay(500)

    const pet = mockPets.find((p) => p.id === params.pet_id) || mockPets[0]
    const address =
      mockAddresses.find((a) => a.id === params.address_id) || mockAddresses[0]

    // Calculate end time (1 hour after start)
    const startTime = new Date(`${params.booking_date}T${params.appt_start}`)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000)
    const endTimeStr = endTime.toTimeString().slice(0, 5)

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Appointment booking created successfully",
        appointment: {
          appt_type: "At Home Visit",
          appt_start: params.appt_start,
          appt_end: endTimeStr,
          booking_date: params.booking_date,
          pet_name: pet.name,
          pet_type: "DOG" as const,
          pet_profile_image: pet.profile_image,
          address: {
            id: address.id,
            tag: address.tag,
            location: address.location,
            address_line1: address.address_line1,
            address_line2: address.address_line2,
            directions: address.directions,
          },
          clinic_contact: "+91-9876543210",
        },
      },
    })
  },

  getAppointmentsV2: async (params, opts) => {
    await delay(500)

    const appointments = [
      {
        id: generateUUID(),
        sub_booking_id: generateUUID(),
        pet_id: mockPets[0].id,
        pet_name: mockPets[0].name,
        pet_type: "DOG",
        pet_profile_image: mockPets[0].profile_image,
        vet_id: generateUUID(),
        vet_name: "Dr. Sharma",
        vet_image: "https://example.com/dr-sharma.jpg",
        clinic_name: "PetCare Bangalore",
        booking_date: "2025-01-15",
        appt_start: "10:00",
        appt_end: "11:00",
        appt_status: "CONFIRMED",
        appt_type: "At Home Visit",
        appt_type_id: generateUUID(),
        category: "UPCOMING" as const,
        coupon_code: null,
      },
      {
        id: generateUUID(),
        sub_booking_id: generateUUID(),
        pet_id: mockPets[1].id,
        pet_name: mockPets[1].name,
        pet_type: "CAT",
        pet_profile_image: mockPets[1].profile_image,
        vet_id: generateUUID(),
        vet_name: "Dr. Patel",
        vet_image: null,
        clinic_name: "PetCare Bangalore",
        booking_date: "2024-12-10",
        appt_start: "14:00",
        appt_end: "15:00",
        appt_status: "COMPLETED",
        appt_type: "Vaccination",
        appt_type_id: generateUUID(),
        category: "COMPLETED" as const,
        coupon_code: "FIRST50",
      },
    ]

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Appointments fetched successfully",
        appointments,
      },
    })
  },

  getAppointmentDetailsV2: async (params, opts) => {
    await delay(500)

    const appointment = {
      id: params.appointment_id,
      sub_booking_id: generateUUID(),
      pet_id: mockPets[0].id,
      pet_name: mockPets[0].name,
      pet_type: "DOG",
      pet_profile_image: mockPets[0].profile_image,
      vet_id: generateUUID(),
      vet_name: "Dr. Sharma",
      vet_image: "https://example.com/dr-sharma.jpg",
      vet_contact: "+91-9876543210",
      vet_status: "CONFIRMED" as const,
      clinic_id: generateUUID(),
      clinic_name: "PetCare Bangalore",
      clinic_location: "Koramangala, Bangalore",
      clinic_contact: "+91-9876543210",
      booking_date: "2025-01-15",
      appt_start: "10:00",
      appt_end: "11:00",
      appt_status: "CONFIRMED",
      appt_type: "At Home Visit",
      appt_type_id: generateUUID(),
      category: "UPCOMING" as const,
      coupon_code: null,
      invoice_id: null,
      total_tax_amount: 0,
      total_billing_amount: 500,
      payment_status: "PAID" as const,
      address: mockAddresses[0],
    }

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Appointment details fetched successfully",
        appointment,
      },
    })
  },

  cancelAppointmentV2: async (params, opts) => {
    await delay(500)

    // 20% chance of refund being processed for testing
    const hasRefund = Math.random() < 0.8

    return ok({
      status: 200,
      body: {
        status: 200,
        message: "Appointment cancelled successfully",
        appointment: {
          id: params.appointmentid,
          clinic_id: params.clinic_id,
          refund: hasRefund ? { status: "PENDING" as const } : undefined,
        },
      },
    })
  },
}

// ============================================================================
// REAL IMPLEMENTATION
// ============================================================================

const endpointConfig = {
  // Address Book
  getAddressBook: {
    method: "GET" as const,
    path: "/user/address-book",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({}),
    responseSchema: z.object({
      address_book: z.array(AddressSchema),
    }),
    errorResponseSchema: z.object({}),
  },

  getAddress: {
    method: "GET" as const,
    path: "/user/address-book/{addressid}",
    pathParamsSchema: z.object({ addressid: z.string().uuid() }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      address_book: AddressSchema,
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
          lng: z.number(),
        }),
        address_line1: z.string(),
        address_line2: z.string(),
        directions: z.string().nullable(),
      }),
    }),
    responseSchema: z.object({
      address: z.object({
        id: z.string().uuid(),
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
          lng: z.number(),
        }),
        address_line1: z.string(),
        address_line2: z.string(),
        directions: z.string().nullable(),
      }),
    }),
    responseSchema: z.object({
      address: z.object({
        id: z.string().uuid(),
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
      bookingTypes: z.array(BookingTypeSchema),
    }),
    errorResponseSchema: z.object({}),
  },

  checkLocationServiceability: {
    method: "POST" as const,
    path: "/booking/location/serviceability",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({
      location: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    responseSchema: z.object({
      serviceable: z.boolean(),
    }),
    errorResponseSchema: z.object({}),
  },

  getBookingPets: {
    method: "GET" as const,
    path: "/booking/pets",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({}),
    responseSchema: z.object({
      pets: z.array(PetSchema),
    }),
    errorResponseSchema: z.object({}),
  },

  getAtHomeSlots: {
    method: "GET" as const,
    path: "/booking/at-home/slots?clinicid={clinicid}",
    pathParamsSchema: z.object({ clinicid: z.string().uuid() }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      days: z.array(DayWithSlotsSchema),
    }),
    errorResponseSchema: z.object({}),
  },

  createPaymentOrder: {
    method: "POST" as const,
    path: "/booking/at-home/payments/orders",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({
      amount: z.number(),
    }),
    responseSchema: z.object({
      order: PaymentOrderSchema,
    }),
    errorResponseSchema: z.object({}),
  },

  getOrderStatus: {
    method: "GET" as const,
    path: "/booking/at-home/order/{orderid}/status",
    pathParamsSchema: z.object({ orderid: z.string().uuid() }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      order_payment: OrderStatusSchema,
    }),
    errorResponseSchema: z.object({}),
  },

  // Appointments
  createAtHomeAppointment: {
    method: "POST" as const,
    path: "/user/appointment/at-home",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({
      pet_id: z.string().uuid(),
      appt_start: z.string(),
      booking_date: z.string(),
      address_id: z.string(),
      reason_for_visit: z.enum(["VACCINATION", "CHECK-UP", "SICK", "OTHER"]),
      notes: z.string(),
    }),
    responseSchema: z.object({
      appointment: z.object({
        appt_type: z.string(),
        appt_start: z.string(),
        appt_end: z.string(),
        booking_date: z.string(),
        pet_name: z.string(),
        pet_type: z.enum(["DOG", "CAT"]),
        pet_profile_image: z.string().nullable(),
        address: AppointmentAddressSchema,
        clinic_contact: z.string(),
      }),
    }),
    errorResponseSchema: z.object({}),
  },

  getAppointmentsV2: {
    method: "GET" as const,
    path: "/user/appointments",
    pathParamsSchema: z.object({}),
    requestSchema: z.object({}),
    responseSchema: z.object({
      appointments: z.array(AppointmentSchema),
    }),
    errorResponseSchema: z.object({}),
  },

  getAppointmentDetailsV2: {
    method: "GET" as const,
    path: "/user/appointment/{appointment_id}",
    pathParamsSchema: z.object({ appointment_id: z.string().uuid() }),
    requestSchema: z.object({}),
    responseSchema: z.object({
      appointment: AppointmentDetailSchema,
    }),
    errorResponseSchema: z.object({}),
  },

  cancelAppointmentV2: {
    method: "PUT" as const,
    path: "/user/appointment/{appointmentid}/cancel",
    pathParamsSchema: z.object({ appointmentid: z.string().uuid() }),
    requestSchema: z.object({
      clinic_id: z.string().uuid(),
      sub_booking_id: z.string().uuid(),
    }),
    responseSchema: z.object({
      appointment: z.object({
        id: z.string().uuid(),
        clinic_id: z.string().uuid(),
        refund: RefundSchema.optional(),
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
