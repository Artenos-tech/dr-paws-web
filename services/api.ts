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
        name: z.string(),
        mobile: z.string(),
        role: z.enum(["ADMIN", "USER"]),
        profile_image: z.string().nullable(),
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
        role: z.enum(["ADMIN", "USER"]),
        otp: z.string(),
        address1: z.string(),
        address2: z.string(),
        city: z.string(),
        pincode: z.string(),
        state: z.string(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        token: z.string(),
        user: z.object({
          id: z.string(),
          mobile: z.string(),
          name: z.string(),
          role: z.enum(["ADMIN", "USER"]),
          email: z.string().nullable(),
          address1: z.string().nullable(),
          address2: z.string().nullable(),
          city: z.string().nullable(),
          state: z.string().nullable(),

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
        role: z.enum(["ADMIN", "USER"]),
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
        role: z.enum(["ADMIN", "USER"]),
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
        role: z.enum(["ADMIN", "USER"]),
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
          role: z.enum(["ADMIN", "USER"]),
          email: z.string().nullable(),
          address1: z.string().nullable(),
          address2: z.string().nullable(),
          city: z.string().nullable(),
          state: z.string().nullable(),

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
          id: z.string(),
          vetport_id: z.number(),
          mobile: z.string(),
          name: z.string(),
          role: z.enum(["ADMIN", "USER"]),
          email: z.string().nullable(),
          address1: z.string().nullable(),
          address2: z.string().nullable(),
          city: z.string().nullable(),
          state: z.string().nullable(),
          pincode: z.string().nullable(),
          profile_image: z.string().nullable(),
        }),
        pets: z.array(
          z.object({
            vetport_id: z.number().nullable(),
            name: z.string(),
            type: z.string().nullable(),
            breed: z.string().nullable(),
            weight: z.string().nullable(),
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
          pincode: z.string().nullable(),
          profile_image: z.string().nullable(),
        }),
      }),
      responseSchema: z.object({
        user: z.object({
          id: z.string(),
          vetport_id: z.number(),
          mobile: z.string(),
          name: z.string(),
          role: z.enum(["ADMIN", "USER"]),
          email: z.string().nullable(),
          address1: z.string().nullable(),
          address2: z.string().nullable(),
          city: z.string().nullable(),
          state: z.string().nullable(),
          pincode: z.string().nullable(),
          profile_image: z.string().nullable(),
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
            id: z.string(),
            pet_vetport_id: z.number(),
            pet_name: z.string(),
            pet_type: z.string().optional(),
            pet_profile_image: z.string().nullable(),
            user_vetport_id: z.number(),
            vet_vetport_id: z.number(),
            vet_name: z.string(),
            vet_image: z.object({
              type: z.enum(["url", "ref"]),
              value: z.string(),
            }),
            clinic_id: z.number(),
            clinic_name: z.string(),
            clinic_location: z.string(),
            clinic_contact: z.string(),
            appt_start: z.string(),
            appt_end: z.string(),
            appt_status: z.string().nullable(),
            appt_reason: z.string().nullable(),
            appt_type: z.string(),
            appt_type_id: z.number(),
            category: z.enum(["UPCOMING", "PAST", "CANCELLED"]),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getStaffSchedule: {
      method: "GET",
      path: "/booking/clinic/{clinicid}/staffschedule/{staffid}/appointment/{appttypeid}?subtype={subtype}",
      pathParamsSchema: z.object({
        clinicid: z.string(),
        staffid: z.string(),
        appttypeid: z.string(),
        subtype: z.string().optional(),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        staffschedule: z.object({
          slots: z.record(z.string(), z.array(z.string())),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    getBestAvailableVetSchedule: {
      method: "GET",
      path: "/booking/schedule/best?clinicid={clinicid}&apptypeid={apptypeid}",
      pathParamsSchema: z.object({
        clinicid: z.string(),
        apptypeid: z.string(),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        slots: z.record(
          z.string(),
          z.record(
            z.string(),
            z.array(
              z.object({
                staffId: z.number(),
              }),
            ),
          ),
        ),
        preferredVets: z.array(
          z.object({
            staffId: z.number(),
            appCount: z.number(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    createAppointment: {
      method: "POST",
      path: "/user/appointment",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        vet_id: z.number(),
        pet_id: z.number(),
        appt_start: z.string(),
        appt_end: z.string(),
        appt_reason: z.string().nullable(),
        clinic_id: z.number(),
        appt_type_id: z.number(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        appointment: z.object({
          id: z.number(),
          clinic_name: z.string(),
          clinic_location: z.string(),
          clinic_contact: z.string(),
          vet_name: z.string(),
          vet_image: z.object({
            type: z.enum(["url", "ref"]),
            value: z.string(),
          }),
          appt_start: z.string(),
          appt_end: z.string(),
          appt_reason: z.string().nullable(),
          appt_type: z.string(),
          pet_name: z.string(),
          pet_type: z.string().nullable(),
          pet_profile_image: z.string().nullable(),
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
        species: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            displayName: z.string(),
            status: z.enum(["Active", "Inactive", "Unknown"]),
            uid: z.string(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getPetBreeds: {
      method: "GET",
      path: "/pets/breeds/{speciesid}",
      pathParamsSchema: z.object({ speciesid: z.string() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        breeds: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            speciesid: z.number(),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getPetGender: {
      method: "GET",
      path: "/pets/gender/{speciesid}",
      pathParamsSchema: z.object({ speciesid: z.string() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        gender: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
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
            vetport_id: z.number(),
            name: z.string(),
            type: z.string().nullable(),
            breed: z.string().nullable(),
            weight: z.string().nullable(),
            gender: z.string().nullable(),
            dob: z.string().nullable(),
            profile_image: z.string().nullable(),
          }),
        ),
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
          species: z.object({
            id: z.number(),
            name: z.string(),
          }),
        }),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        pet: z.object({
          vetport_id: z.number(),
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
          vetport_id: z.number(),
          name: z.string(),
          species: z.object({
            id: z.number(),
            name: z.string(),
          }),
          breed: z
            .object({
              id: z.number(),
              name: z.string(),
            })
            .nullable(),
          weight: z.number().nullable(),
          gender: z
            .object({
              id: z.number(),
              name: z.string(),
            })
            .nullable(),
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
            vetPortId: z.number(),
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
            id: z.number(),
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

    getDoctors: {
      method: "GET",
      path: "/staff",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        staff: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            image: z.string(),
            clinicids: z.array(z.number()),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getDoctorsForClinic: {
      method: "GET",
      path: "/booking/clinic/{clinicid}/staff?grooming={grooming}",
      pathParamsSchema: z.object({
        clinicid: z.number(),
        grooming: z.enum(["y", "n"]),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        staff: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            image: z.object({
              type: z.enum(["url", "ref"]),
              value: z.string(),
            }),
            clinicids: z.array(z.number()),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getSubscriptions: {
      method: "GET",
      path: "/user/subscriptions",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        subscriptions: z.array(
          z.object({
            id: z.number(),
            start_date: z.string(),
            end_date: z.string(),
            plan: z.object({
              id: z.number(),
              name: z.string(),
              features: z.array(
                z.object({
                  name: z.string(),
                  description: z.string().nullable(),
                  value: z.number(),
                  used: z.number(),
                  type: z.string(),
                }),
              ),
            }),
            pet: z.object({
              id: z.number(),
              name: z.string(),
            }),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getPetSubscription: {
      method: "GET",

      path: "/user/subscriptions/pet/{pet_id}",
      pathParamsSchema: z.object({
        pet_id: z.number(),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        subscription: z
          .object({
            id: z.number(),
            start_date: z.string(),
            end_date: z.string(),
            plan: z.object({
              id: z.number(),
              name: z.string(),
            }),
            pet: z.object({
              id: z.number(),
              name: z.string(),
            }),
          })
          .nullable(),
      }),
      errorResponseSchema: z.object({}),
    },

    createOrder: {
      method: "POST",
      path: "/user/order",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        amount: z.number(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        order: z.object({
          orderId: z.string(),
          paymentSessionId: z.string(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    cancelAppointment: {
      method: "PUT",
      path: "/user/appointment/{appointmentid}/cancel",
      pathParamsSchema: z.object({ appointmentid: z.string() }),
      requestSchema: z.object({
        clinic_id: z.number(),
        vet_id: z.number(),
        pet_id: z.number(),
        pet_name: z.string(),
        appt_start: z.string(),
        appt_end: z.string(),
        appt_type_id: z.number(),
        reason: z.string(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
        appointment: z.object({
          id: z.number(),
          clinic_id: z.number(),
          vet_id: z.number(),
          pet_id: z.number(),
        }),
      }),
      errorResponseSchema: z.object({}),
    },

    verifyPayment: {
      method: "GET",
      path: "/user/order/status/{orderId}/{planId}/{petId}",
      pathParamsSchema: z.object({
        orderId: z.string(),
        planId: z.number(),
        petId: z.number(),
      }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        order_payment: z.object({
          success: z.boolean(),
          status: z.enum([
            "ACTIVE",
            "PAID",
            "EXPIRED",
            "TERMINATED",
            "TERMINATION_REQUESTED",
          ]),
        }),
      }),
      errorResponseSchema: z.object({
        // body: z.object({
        // status: z.number(),
        // message: z.string(),
        // }),
      }),
    },

    getAllPlans: {
      method: "GET",
      path: "/plans",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        plans: z.array(
          z.object({
            id: z.number(),
            name: z.string().min(1),
            description: z.string().nullable(),
            price: z.number().min(0),
            duration_months: z.number().min(1),
            version: z.number(),
            species: z.array(z.enum(["dog", "cat"])),
            age: z.enum(["CHILD", "ADULT", "SENIOR"]).nullable(),
            type: z.enum(["GROOMING", "MEDICAL", "COMPREHENSIVE"]).nullable(),
            published: z.boolean(),
            display_order: z.number(),
            created_at: z.string(),
            updated_at: z.string(),
            features: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                description: z.string().nullable(),
                type: z.enum(["DISCOUNT", "SESSIONS", "VACCINATIONS"]),
                value: z.number().nullable(),
              }),
            ),
          }),
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getClinicsForDisplay: {
      method: "GET",
      path: "/clinics",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        clinics: z
          .array(
            z.object({
              id: z.number(),
              name: z.string(),
              services: z.string(),
              image: z.object({
                type: z.enum(["url", "ref"]),
                value: z.string(),
              }),
            }),
          )
          .nullable(),
      }),
      errorResponseSchema: z.object({}),
    },

    getClinicForDisplay: {
      method: "GET",
      path: "/clinic/{clinicid}",
      pathParamsSchema: z.object({ clinicid: z.string() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        clinic: z
          .object({
            id: z.number(),
            name: z.string(),
            contact: z.string(),
            image: z.object({
              type: z.enum(["url", "ref"]),
              value: z.string(),
            }),
            gmapsUrl: z.string(),
            address: z.string(),
            city: z.string(),
            services: z.string(),
            parkingInfo: z.string(),
            timings: z.array(
              z.object({
                dayOfWeek: z.string().nullable(),
                openTime: z.string().nullable(),
                closeTime: z.string().nullable(),
                is24Hours: z.boolean(),
              }),
            ),
            gallery: z.record(
              z.string(),
              z.object({
                imageUrl: z.string(),
                imageOrder: z.number(),
              }),
            ),
          })
          .nullable(),
      }),
      errorResponseSchema: z.object({}),
    },

    getDoctorsForDisplay: {
      method: "GET",
      path: "/doctors",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        doctors: z
          .array(
            z.object({
              id: z.number(),
              displayName: z.string(),
              position: z.string(),
              experience: z.string(),
              availableToDisplayAt: z.array(
                z.object({
                  id: z.number(),
                  name: z.string(),
                }),
              ),
              imageUrl: z.object({
                type: z.enum(["url", "ref"]),
                value: z.string(),
              }),
            }),
          )
          .nullable(),
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
            id: z.number(),
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
                id: z.number(),
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
        doctors: z
          .array(
            z.object({
              id: z.number(),
              displayName: z.string(),
              position: z.string(),
              experience: z.string(),
              availableToDisplayAt: z.array(
                z.object({
                  id: z.number(),
                  name: z.string(),
                }),
              ),
              imageUrl: z.object({
                type: z.enum(["url", "ref"]),
                value: z.string(),
              }),
            }),
          )
          .nullable(),
      }),
      errorResponseSchema: z.object({}),
    },

    rescheduleAppointment: {
      method: "PUT",
      path: "/user/appointment/{appointmentid}/reschedule",
      pathParamsSchema: z.object({ appointmentid: z.string() }),
      requestSchema: z.object({
        vet_id: z.number(),
        appt_start: z.number().int(),
        appt_end: z.number().int(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
      }),
      errorResponseSchema: z.object({}),
    },

    getInvoices: {
      method: "GET",
      path: "/user/invoices",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        invoices: z.array(z.object({
          id: z.number(),
          clinicname: z.string(),
          invoiceno: z.number(),
          createdon: z.string(),
          amount: z.number(),
          invoiceline: z.array(z.object({
            planitemid: z.number(),
            planitem: z.string().optional(),
            quantity: z.number(),
            cliniccost: z.number(),
            tax: z.number(),
            discount: z.number(),
            total: z.number(),
          }))
        }))
      }),
      errorResponseSchema: z.object({}),
    }
  },
})
