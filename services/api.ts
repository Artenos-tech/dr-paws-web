import { createAPIClient, RequestContext, z } from "../lib/apiclient"

export {
  FetchAPIError,
  ParseAPIError,
  SchemaAPIError,
  ErrorResponseAPIError,
} from "../lib/apiclient"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

const AUTH_TOKEN_HEADER_NAME = "X-Auth-Token"

const AUTH_TOKEN_LOCALSTORAGE_KEY = "authToken"

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

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_KEY, token)
    requestContext.addHeader(AUTH_TOKEN_HEADER_NAME, token)
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
    requestContext.removeHeader(AUTH_TOKEN_HEADER_NAME)
  }
}

export default createAPIClient({
  baseUrl: API_BASE_URL,
  baseResponseSchema: z.object({
    status: z.number(),
    message: z.string(),
  }),
  requestContext,
  endpointConfig: {
    signupOTP: {
      method: "POST",
      path: "/signup/otp",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },

    signupVerify: {
      method: "POST",
      path: "/signup/verify",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
        otp: z.string(),
        name: z.string(),
        address1: z.string(),
        address2: z.string(),
        city: z.string(),
        pincode: z.string(),
        state: z.string(),
        country: z.string(),
        profile_image: z.string().nullable(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        token: z.string(),
        user: z.object({
          id: z.string(),
          mobile: z.string(),
          name: z.string(),
          email: z.string().nullable(),
          address1: z.string().nullable(),
          address2: z.string().nullable(),
          city: z.string().nullable(),
          state: z.string().nullable(),
          country: z.string().nullable(),
          pincode: z.string().nullable(),
          profile_image: z.string().nullable(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    signupCancel: {
      method: "POST",
      path: "/signup/cancel",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },

    loginOTP: {
      method: "POST",
      path: "/login/otp",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },

    loginVerify: {
      method: "POST",
      path: "/login/verify",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
        otp: z.string(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        token: z.string(),
        user: z.object({
          id: z.string(),
          mobile: z.string(),
          name: z.string(),
          email: z.string().nullable(),
          address1: z.string().nullable(),
          address2: z.string().nullable(),
          city: z.string().nullable(),
          state: z.string().nullable(),
          country: z.string().nullable(),
          pincode: z.string().nullable(),
          profile_image: z.string().nullable(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    logout: {
      method: "POST",
      path: "/logout",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },

    getUser: {
      method: "GET",
      path: "/user",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        user: z.object({
          id: z.string().uuid(),
          mobile: z.string(),
          name: z.string(),
          role: z.enum(["ADMIN", "USER"]).optional(),
          email: z.string().nullable(),
          address1: z.string().nullable(),
          address2: z.string().nullable(),
          city: z.string().nullable(),
          state: z.string().nullable(),
          country: z.string().nullable(),
          pincode: z.string().nullable(),
          profile_image: z.string().nullable(),
        }),
        pets: z.array(
          z.object({
            id: z.string().uuid(),
            name: z.string(),
            type: z.string().nullable(),
            breed: z.string().nullable(),
            // weight: z.string().nullable(),
            gender: z.string().nullable(),
            dob: z.string().nullable(),
            profile_image: z.string().nullable(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    updateUser: {
      method: "PUT",
      path: "/user",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        user: z.object({
          name: z.string(),
          mobile: z.string(),
          email: z.string().nullable(),
          address1: z.string().nullable(),
          address2: z.string().nullable(),
          city: z.string().nullable(),
          state: z.string().nullable(),
          country: z.string().nullable(),
          pincode: z.string().nullable(),
          profile_image: z.string().nullable(),
        }),
      }),
      responseSchema: z.object({
        user: z.object({
          id: z.string().uuid(),
          mobile: z.string(),
          name: z.string(),
          role: z.enum(["ADMIN", "USER"]).optional(),
          email: z.string().nullable(),
          address1: z.string().nullable(),
          address2: z.string().nullable(),
          city: z.string().nullable(),
          state: z.string().nullable(),
          country: z.string().nullable(),
          pincode: z.string().nullable(),
          profile_image: z.string().nullable(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    getPetSpecies: {
      method: "GET",
      path: "/pets/species",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        species: z.array(z.enum(["DOG", "CAT", "OTHER"])),
      }),
      errorResponseSchema: z.object({}),
    },

    getPetBreeds: {
      method: "GET",
      path: "/pets/breeds/{species}",
      pathParamsSchema: z.object({ species: z.enum(["DOG", "CAT", "OTHER"]) }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        breeds: z.array(
          z.object({
            id: z.string().uuid(),
            name: z.string(),
            species: z.enum(["DOG", "CAT", "OTHER"]),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getPetGender: {
      method: "GET",
      path: "/pets/gender",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        gender: z.array(z.enum(["MALE", "FEMALE"])),
      }),
      errorResponseSchema: z.object({}),
    },

    getPetSizes: {
      method: "GET",
      path: "/pets/sizes",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        sizes: z.array(
          z.object({
            id: z.string().uuid(),
            name: z.string(),
            order: z.number(),
            description: z.string(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getPetCoats: {
      method: "GET",
      path: "/pets/coats",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        coats: z.array(
          z.object({
            id: z.string().uuid(),
            name: z.string(),
            order: z.number(),
            description: z.string(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getPets: {
      method: "GET",
      path: "/user/pets",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        pets: z.array(
          z.object({
            id: z.string().uuid(),
            name: z.string(),
            type: z.enum(["DOG", "CAT", "OTHER"]).nullable(),
            breed: z.string().nullable(),
            breedId: z.string().nullable(),
            // weight: z.string().nullable(),
            gender: z.enum(["MALE", "FEMALE"]).nullable(),
            dob: z.string().nullable(),
            profile_image: z.string().nullable(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getPetById: {
      method: "GET",
      path: "/user/pet/{petid}",
      pathParamsSchema: z.object({ petid: z.string().uuid() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        pet: z.object({
          id: z.string(),
          name: z.string(),
          type: z.enum(["DOG", "CAT", "OTHER"]).nullable(),
          breed: z.string().nullable(),
          breedId: z.string().nullable(),
          gender: z.enum(["MALE", "FEMALE"]).nullable(),
          dob: z.string().nullable(),
          profile_image: z.string().nullable(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    addNewPet: {
      method: "POST",
      path: "/user/pet",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        pet: z.object({
          name: z.string(),
          species: z.enum(["DOG", "CAT", "OTHER"]),
          gender: z.enum(["MALE", "FEMALE"]),
        }),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        pet: z.object({
          id: z.string().uuid(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    updatePet: {
      method: "PUT",
      path: "/user/pet",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        pet: z.object({
          id: z.string().uuid(),
          name: z.string(),
          species: z.enum(["DOG", "CAT", "OTHER"]),
          breed: z
            .object({
              id: z.string().uuid(),
              name: z.string(),
            })
            .nullable()
            .optional(),
          breedSize: z
            .object({
              id: z.string().uuid(),
              name: z.string(),
            })
            .nullable(),
          coat: z
            .object({
              id: z.string().uuid(),
              name: z.string(),
            })
            .nullable(),
          // weight: z.number().nullable(),
          gender: z.enum(["MALE", "FEMALE"]),
          dob: z.string().nullable(),
          profileImage: z.string().nullable(),
        }),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },

    getAppointmentServices: {
      method: "GET",
      path: "/booking/appointmenttypes",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        appointmentTypes: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            // vetPortId: z.number(),
            isGrooming: z.boolean(),
            subtypes: z
              .array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                  description: z.string(),
                }),
              )
              .optional(),
            displayOrder: z.number(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getClinicsForBooking: {
      method: "GET",
      path: "/booking/clinics",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        clinics: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            services: z.string(),
            image: z.object({
              type: z.enum(["url", "ref"]),
              value: z.string(),
            }),
            location: z.string(),
            contact: z.string(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getMissingAttributes: {
      method: "GET",
      path: "/booking/missingattributes/clinic/{clinicid}/pet/{petid}?grooming={grooming}",
      pathParamsSchema: z.object({
        clinicid: z.string().uuid(),
        petid: z.string().uuid(),
        grooming: z.enum(["y", "n"]),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        attributes: z.array(
          z.enum([
            "Name",
            "Type",
            "Breed",
            "Gender",
            "Birthday",
            "Breed size",
            "Coat size",
          ]),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getDoctorsForClinic: {
      method: "GET",
      path: "/booking/clinic/{clinicid}/staff?grooming={grooming}&catalogue={catalogue}&date={date}&petid={petid}&pettype={pettype}",
      pathParamsSchema: z.object({
        clinicid: z.string().uuid(),
        grooming: z.enum(["y", "n"]),
        catalogue: z.string(),
        date: z.string(),
        petid: z.string().uuid(),
        pettype: z.enum(["DOG", "CAT", "OTHER"]),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        staff: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            displayImage: z.string().url().nullable(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getDoctor: {
      method: "GET",
      path: "/booking/staff/{staffid}",
      pathParamsSchema: z.object({
        staffid: z.string().uuid(),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        staff: z.object({
          id: z.string().uuid(),
          name: z.string(),
          displayImage: z.string().url().nullable(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    getSlotsForStaff: {
      method: "GET",
      path: "/booking/slots/staff/{staffid}?clinicid={clinicid}&catalogue={catalogue}&petid={petid}&pettype={pettype}&date={date}",
      pathParamsSchema: z.object({
        staffid: z.string().uuid(),
        clinicid: z.string().uuid(),
        catalogue: z.string(),
        petid: z.string().uuid(),
        pettype: z.enum(["DOG", "CAT", "OTHER"]),
        date: z.string(),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        slots: z.array(
          z.object({ startTime: z.string(), endTime: z.string() }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getSlotsForGrooming: {
      method: "GET",
      path: "/booking/slots/grooming?clinicid={clinicid}&catalogue={catalogue}&petid={petid}&pettype={pettype}&date={date}",
      pathParamsSchema: z.object({
        clinicid: z.string().uuid(),
        catalogue: z.string(),
        petid: z.string().uuid(),
        pettype: z.enum(["DOG", "CAT", "OTHER"]),
        date: z.string(),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        slots: z.array(
          z.object({
            startTime: z.string(),
            endTime: z.string(),
            staffIds: z.array(z.string()),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getBestAvailableVetSchedule: {
      method: "GET",
      path: "/booking/schedule/best?clinicid={clinicid}&catalogue={catalogue}&petid={petid}&pettype={pettype}&date={date}",
      pathParamsSchema: z.object({
        clinicid: z.string().uuid(),
        catalogue: z.string(),
        petid: z.string().uuid(),
        pettype: z.enum(["DOG", "CAT", "OTHER"]),
        date: z.string(),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        slots: z.array(
          z.object({
            startTime: z.string(),
            endTime: z.string(),
            staffIds: z.array(z.string().uuid()),
          }),
        ),
        preferredVets: z.array(
          z.object({
            staffId: z.string().uuid(),
            appCount: z.number(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getCouponCodes: {
      method: "GET",
      path: "/booking/couponcodes",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        codes: z.array(z.string()),
      }),
      errorResponseSchema: z.object({}),
    },

    applyCouponCode: {
      method: "GET",
      path: "/booking/validatecoupon?code={code}",
      pathParamsSchema: z.object({
        code: z.string(),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },

    createAppointment: {
      method: "POST",
      path: "/user/appointment",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        vet_id: z.string().uuid(),
        pet_id: z.string().uuid(),
        appt_start: z.string(),
        appt_end: z.string(),
        booking_date: z.string(),
        clinic_id: z.string().uuid(),
        appt_type_id: z.string(),
        subtype_id: z.string(),
        pet_type: z.enum(["DOG", "CAT", "OTHER"]),
        is_grooming: z.boolean(),
        coupon_code: z.string().optional(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        appointment: z.object({
          // id: z.number(),
          clinic_name: z.string(),
          clinic_location: z.string(),
          clinic_contact: z.string(),
          vet_name: z.string(),
          vet_image: z.string().nullable(),
          appt_start: z.string(),
          appt_end: z.string(),
          booking_date: z.string(),
          // appt_reason: z.string().nullable(),
          appt_type: z.string(),
          pet_name: z.string().nullable(),
          pet_type: z.string().nullable(),
          pet_profile_image: z.string().nullable(),
          coupon_code: z.string().optional(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    getAppointments: {
      method: "GET",
      path: "/user/appointments",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        appointments: z.array(
          z.object({
            id: z.string().uuid(),
            sub_booking_id: z.string().uuid(),
            pet_id: z.string().uuid(),
            pet_name: z.string(),
            pet_type: z.string().nullable(),
            pet_profile_image: z.string().nullable(),
            vet_id: z.string().uuid(),
            vet_name: z.string(),
            vet_image: z.string().url().nullable(),
            clinic_id: z.string().uuid(),
            clinic_name: z.string(),
            clinic_location: z.string(),
            clinic_contact: z.string(),
            booking_date: z.string(),
            appt_start: z.string(),
            appt_end: z.string(),
            appt_status: z.string().nullable(),
            appt_type: z.string().nullable(),
            appt_type_id: z.string().uuid(),
            category: z.enum(["UPCOMING", "COMPLETED", "REQUESTED", "CANCELLED"]),
            coupon_code: z.string().nullable().optional(),
            invoice_id: z.string().uuid().nullable(),
            total_billing_amount: z.number(),
            total_tax_amount: z.number(),
            payment_status: z.enum([
              "PAID",
              "UNPAID",
              "NO_BILL",
              "PARTIALLY_PAID",
              "OVERPAID",
            ]),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    cancelAppointment: {
      method: "PUT",
      path: "/user/appointment/{appointmentid}/cancel",
      pathParamsSchema: z.object({ appointmentid: z.string().uuid() }),
      requestSchema: z.object({
        clinic_id: z.string().uuid(),
        sub_booking_id: z.string().uuid().optional(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        appointment: z.object({
          id: z.string().uuid(),
          clinic_id: z.string().uuid(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    // rescheduleAppointment: {
    //   method: "PUT",
    //   path: "/user/appointment/{appointmentid}/reschedule",
    //   pathParamsSchema: z.object({ appointmentid: z.string() }),
    //   requestSchema: z.object({
    //     vet_id: z.number(),
    //     appt_start: z.number().int(),
    //     appt_end: z.number().int(),
    //   }),
    //   responseSchema: z.object({
    //     status: z.number(),
    //     message: z.string(),
    //   }),
    //   errorResponseSchema: z.object({}),
    // },

    // getDoctors: {
    //   method: "GET",
    //   path: "/staff",
    //   pathParamsSchema: z.object({}),
    //   requestSchema: z.object({}),
    //   responseSchema: z.object({
    //     staff: z.array(
    //       z.object({
    //         id: z.number(),
    //         name: z.string(),
    //         image: z.string(),
    //         clinicids: z.array(z.number()),
    //       }),
    //     ),
    //   }),
    //   errorResponseSchema: z.object({}),
    // },

    // getSubscriptions: {
    //   method: "GET",
    //   path: "/user/subscriptions",
    //   pathParamsSchema: z.object({}),
    //   requestSchema: z.object({}),
    //   responseSchema: z.object({
    //     subscriptions: z.array(
    //       z.object({
    //         id: z.number(),
    //         start_date: z.string(),
    //         end_date: z.string(),
    //         plan: z.object({
    //           id: z.number(),
    //           name: z.string(),
    //           features: z.array(
    //             z.object({
    //               name: z.string(),
    //               description: z.string().nullable(),
    //               value: z.number().nullable(),
    //               used: z.number(),
    //               type: z.string(),
    //             }),
    //           ),
    //         }),
    //         pet: z.object({
    //           id: z.number(),
    //           name: z.string(),
    //         }),
    //       }),
    //     ),
    //   }),
    //   errorResponseSchema: z.object({}),
    // },

    // getPetSubscription: {
    //   method: "GET",

    //   path: "/user/subscriptions/pet/{pet_id}",
    //   pathParamsSchema: z.object({
    //     pet_id: z.number(),
    //   }),
    //   requestSchema: z.object({}),
    //   responseSchema: z.object({
    //     status: z.number(),
    //     message: z.string(),
    //     subscription: z
    //       .object({
    //         id: z.number(),
    //         start_date: z.string(),
    //         end_date: z.string(),
    //         plan: z.object({
    //           id: z.number(),
    //           name: z.string(),
    //         }),
    //         pet: z.object({
    //           id: z.number(),
    //           name: z.string(),
    //         }),
    //       })
    //       .nullable(),
    //   }),
    //   errorResponseSchema: z.object({}),
    // },

    // createOrder: {
    //   method: "POST",
    //   path: "/user/order",
    //   pathParamsSchema: z.object({}),
    //   requestSchema: z.object({
    //     amount: z.number(),
    //   }),
    //   responseSchema: z.object({
    //     status: z.number(),
    //     message: z.string(),
    //     order: z.object({
    //       orderId: z.string(),
    //       paymentSessionId: z.string(),
    //     }),
    //   }),
    //   errorResponseSchema: z.object({}),
    // },

    // verifyPayment: {
    //   method: "GET",
    //   path: "/user/order/status/{orderId}/{planId}/{petId}",
    //   pathParamsSchema: z.object({
    //     orderId: z.string(),
    //     planId: z.number(),
    //     petId: z.number(),
    //   }),
    //   requestSchema: z.object({}),
    //   responseSchema: z.object({
    //     order_payment: z.object({
    //       success: z.boolean(),
    //       status: z.enum([
    //         "ACTIVE",
    //         "PAID",
    //         "EXPIRED",
    //         "TERMINATED",
    //         "TERMINATION_REQUESTED",
    //       ]),
    //     }),
    //   }),
    //   errorResponseSchema: z.object({
    //     // body: z.object({
    //     // status: z.number(),
    //     // message: z.string(),
    //     // }),
    //   }),
    // },

    // getAllPlans: {
    //   method: "GET",
    //   path: "/plans",
    //   pathParamsSchema: z.object({}),
    //   requestSchema: z.object({}),
    //   responseSchema: z.object({
    //     plans: z.array(
    //       z.object({
    //         id: z.number(),
    //         name: z.string().min(1),
    //         description: z.string().nullable(),
    //         price: z.number().min(0),
    //         duration_months: z.number().min(1),
    //         version: z.number(),
    //         species: z.array(z.enum(["dog", "cat"])),
    //         age: z.enum(["CHILD", "ADULT", "SENIOR"]).nullable(),
    //         type: z.enum(["GROOMING", "MEDICAL", "COMPREHENSIVE"]).nullable(),
    //         published: z.boolean(),
    //         display_order: z.number(),
    //         created_at: z.string(),
    //         updated_at: z.string(),
    //         features: z.array(
    //           z.object({
    //             id: z.number(),
    //             name: z.string(),
    //             description: z.string().nullable(),
    //             type: z.enum(["DISCOUNT", "REDEEMABLE"]),
    //             value: z.number().nullable(),
    //           }),
    //         ),
    //       }),
    //     ),
    //   }),
    //   errorResponseSchema: z.object({}),
    // },

    getClinicsForDisplay: {
      method: "GET",
      path: "/clinics",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        clinics: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            services: z.string(),
            image: z.object({
              type: z.enum(["url", "ref"]),
              value: z.string(),
            }),
            bookable: z.boolean(),
            contact: z.string(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getClinicForDisplay: {
      method: "GET",
      path: "/clinic/{clinicid}",
      pathParamsSchema: z.object({ clinicid: z.string() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        clinic: z.object({
          id: z.string(),
          name: z.string(),
          services: z.string(),
          image: z.object({
            type: z.enum(["url", "ref"]),
            value: z.string(),
          }),
          bookable: z.boolean(),
          contact: z.string(),
          gmapsUrl: z.string(),
          address: z.string(),
          city: z.string(),
          parkingInfo: z.string(),
          timings: z.array(
            z.object({
              dayOfWeek: z.string().nullable(),
              openTime: z.string().nullable(),
              closeTime: z.string().nullable(),
              is24Hours: z.boolean(),
            }),
          ),
          gallery: z.array(z.string()),
          reviews: z.array(
            z.object({
              id: z.string(),
              author: z.string(),
              rating: z.number(),
              review_text: z.string(),
              review_created_at: z.string(),
              profile_image: z.string().nullable(),
            }),
          ),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    getDoctorsForDisplay: {
      method: "GET",
      path: "/doctors",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        doctors: z.array(
          z.object({
            id: z.string(),
            displayName: z.string(),
            position: z.string(),
            experience: z.string(),
            availableToDisplayAt: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
              }),
            ),
            imageUrl: z.object({
              type: z.enum(["url", "ref"]),
              value: z.string(),
            }),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getDoctorForDisplay: {
      method: "GET",
      path: "/doctor/{doctorid}",
      pathParamsSchema: z.object({ doctorid: z.string() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        doctor: z
          .object({
            id: z.string(),
            displayName: z.string(),
            position: z.string(),
            experience: z.string(),
            qualification: z.string(),
            specialization: z.string(),
            about: z.string(),
            passionateAbout: z.string(),
            favPetName: z.string(),
            spiritAnimal: z.string(),
            availableToDisplayAt: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
              }),
            ),
            imageUrl: z.object({
              type: z.enum(["url", "ref"]),
              value: z.string(),
            }),
          })
          .nullable(),
      }),
      errorResponseSchema: z.object({}),
    },

    getDoctorsForClinicForDisplay: {
      method: "GET",
      path: "/clinic/{clinicid}/doctors",
      pathParamsSchema: z.object({ clinicid: z.string() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        doctors: z.array(
          z.object({
            id: z.string(),
            displayName: z.string(),
            position: z.string(),
            experience: z.string(),
            availableToDisplayAt: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
              }),
            ),
            imageUrl: z.object({
              type: z.enum(["url", "ref"]),
              value: z.string(),
            }),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getServiceCategoriesOffered: {
      method: "GET",
      path: "/service-categories",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        serviceCategories: z.array(z.string()),
      }),
      errorResponseSchema: z.object({}),
    },

    getServicesOverview: {
      method: "GET",
      path: "/services-overview",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        servicesOverview: z.record(
          z.string(),
          z.array(z.object({ name: z.string() })),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getServicesDetails: {
      method: "GET",
      path: "/services-details",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        servicesDetails: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            services: z.array(
              z.object({
                img: z.string(),
                title: z.string(),
              }),
            ),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },
    getInvoices: {
      method: "GET",
      path: "/user/invoices",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        invoices: z.array(
          z.object({
            id: z.string(),
            invoiceId: z.string(),
            // clinicname: z.string(),
            // cliniccontact: z.string(),
            // clinicaddress: z.string(),
            // username: z.string(),
            // usercontact: z.string(),
            // useraddress: z.string(),
            // gstin: z.string().nullable(),
            date: z.string(),
            billAmount: z.number(),
            totalTaxAmount: z.number(),
            status: z.enum([
              "NO_BILL",
              "OVERPAID",
              "PARTIALLY_PAID",
              "PAID",
              "UNPAID",
            ]),
            billingLineItems: z.array(
              z.object({
                amount: z.number(),
                name: z.string(),
                taxes: z.array(
                  z.object({
                    taxName: z.string(),
                    taxAmount: z.number(),
                    taxPercentage: z.number(),
                    companyTaxId: z.string().uuid(),
                  }),
                ),
              }),
            ),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getInvoice: {
      method: "GET",
      path: "/user/invoice/{invoiceid}",
      pathParamsSchema: z.object({ invoiceid: z.string() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        invoicePdf: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },

    getMedicalHistoryForPet: {
      method: "GET",
      path: "/user/medicalhistory/pet/{pet_id}",
      pathParamsSchema: z.object({ pet_id: z.string() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        medical_history: z.array(
          z.object({
            clinicName: z.string(),
            bookingId: z.string().optional(),
            attachments: z
              .array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  fileId: z.string().url(),
                  type: z.enum(["DIAGNOSTIC_TESTS", "MISCELLANEOUS"]),
                  resortBookingId: z.string().uuid(),
                  clientId: z.string().uuid(),
                  importMetadata: z
                    .object({
                      attachmentUrl: z.string().url(),
                    })
                    .nullable(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                }),
              )
              .optional(),
            soapNotes: z
              .array(
                z.object({
                  id: z.string().uuid(),
                  bookingId: z.string().uuid(),
                  clientId: z.string().uuid(),
                  subjective: z.string().nullable(),
                  objective: z.string().nullable(),
                  assessment: z.string().nullable(),
                  plan: z.string().nullable(),
                  memo: z.string().nullable(),
                  importMetadata: z
                    .object({
                      soapNoteId: z.string(),
                    })
                    .nullable(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                }),
              )
              .optional(),
            notes: z.string().nullable().optional(),
            bookingDate: z.string().optional(),
            groomingBookings: z
              .array(
                z.object({
                  bookingDate: z.string(),
                  grooming: z.object({
                    name: z.string(),
                  }),
                  groomingBookingServices: z.array(
                    z.object({
                      catalogue: z.object({
                        name: z.string(),
                      }),
                    }),
                  ),
                  status: z.enum([
                    "COMPLETED",
                    "UPCOMING",
                    "NO_SHOW",
                    "ACTIVE",
                  ]),
                  staff: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                  }),
                }),
              )
              .optional(),
            resortServiceBookings: z
              .array(
                z.object({
                  bookingDate: z.string(),
                  resortService: z.object({
                    name: z.string(),
                  }),
                  resortServiceBookingServices: z.array(
                    z.object({
                      catalogue: z.object({
                        name: z.string(),
                      }),
                    }),
                  ),
                  status: z.enum([
                    "COMPLETED",
                    "UPCOMING",
                    "NO_SHOW",
                    "ACTIVE",
                  ]),
                  staff: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                  }),
                }),
              )
              .optional(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },
    getAppointmentMedicalReports: {
      method: "GET",
      path: "/user/appointment/{appointment_id}/medical-reports",
      pathParamsSchema: z.object({ appointment_id: z.string() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        medical_reports: z.object({
          attachments: z
            .array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                fileId: z.string().url(),
                type: z.enum(["DIAGNOSTIC_TESTS", "MISCELLANEOUS"]),
                resortBookingId: z.string().uuid(),
                clientId: z.string().uuid(),
                importMetadata: z
                  .object({
                    attachmentUrl: z.string().url(),
                  })
                  .nullable(),
                createdAt: z.string(),
                updatedAt: z.string(),
              }),
            )
            .optional(),
          soapNotes: z
            .array(
              z.object({
                id: z.string().uuid(),
                bookingId: z.string().uuid(),
                clientId: z.string().uuid(),
                subjective: z.string().nullable(),
                objective: z.string().nullable(),
                assessment: z.string().nullable(),
                plan: z.string().nullable(),
                memo: z.string().nullable(),
                importMetadata: z
                  .object({
                    soapNoteId: z.string(),
                  })
                  .nullable(),
                createdAt: z.string(),
                updatedAt: z.string(),
              }),
            )
            .optional(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },
  },
})
