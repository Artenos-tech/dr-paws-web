import { createAPIClient, RequestContext, z } from "../lib/apiclient";

export {
  FetchAPIError,
  ParseAPIError,
  SchemaAPIError,
  ErrorResponseAPIError,
} from "../lib/apiclient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const AUTH_TOKEN_HEADER_NAME = "X-Auth-Token";

const AUTH_TOKEN_LOCALSTORAGE_KEY = "authToken";

function initRequestContext() {
  const ctx = new RequestContext();
  if (typeof window !== "undefined") {
    const authToken = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
    if (authToken) {
      ctx.addHeader(AUTH_TOKEN_HEADER_NAME, authToken);
    }
  }
  return ctx;
}

const requestContext = initRequestContext();

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_KEY, token);
    requestContext.addHeader(AUTH_TOKEN_HEADER_NAME, token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
    requestContext.removeHeader(AUTH_TOKEN_HEADER_NAME);
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
          current_address: z.string().nullable(),
          profile_image: z.string().nullable(),
        })
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
          current_address: z.string().nullable(),
          profile_image: z.string().nullable(),
        })
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

    getuser: {
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
          current_address: z.string().nullable(),
          profile_image: z.string().nullable(),
        }),
        pets: z.array(
          z.object({
            id: z.string(),
            vetport_id: z.number().nullable(),
            name: z.string(),
            type: z.string().nullable(),
            breed: z.string().nullable(),
            weight: z.string().nullable(),
            gender: z.string().nullable(),
            dob: z.string().nullable(),
            profile_image: z.string().nullable(),
          })
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
          current_address: z.string().nullable(),
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
          current_address: z.string().nullable(),
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
            user_vetport_id: z.number(),
            vet_vetport_id: z.number(),
            vet_name: z.string(),
            clinic_id: z.number(),
            appt_start: z.string(),
            appt_end: z.string(),
            appt_status: z.enum([
              "Check In",
              "Complete",
              "Scheduled",
              "Check out",
              "Attending",
              "Confirm",
              "Cancel",
              "Active",
              "Waiting",
              "Testing",
              "Check-out",
              "Check-in",
              "Confirmed"  
            ]),
            appt_reason: z.string().nullable(),
            appt_type: z.string().nullable(),
            appt_type_id: z.number(),
            category: z.enum(["UPCOMING", "PAST", "CANCELLED"]),
          })
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getStaffSchedule: {
      method: "GET",
      path: "/clinic/{clinicid}/staffschedule/{staffid}/appointment/{appttypeid}?subtype={subtype}",
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

    createAppointment: {
      method: "POST",
      path: "/user/appointment",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        vet_id: z.number(),
        pet_id: z.string(),
        appt_start: z.string(),
        appt_end: z.string(),
        appt_reason: z.string().nullable(),
        clinic_id: z.number(),
        appt_type_id: z.number(),
      }),
      responseSchema: z.object({
        status: z.number(),
        message: z.string(),
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
            status: z.enum(["Active", "Inactive"]),
            uid: z.string(),
          })
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
          })
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
          })
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
            id: z.string(),
            vetport_id: z.number().nullable(),
            name: z.string(),
            type: z.string().nullable(),
            breed: z.string().nullable(),
            weight: z.string().nullable(),
            gender: z.string().nullable(),
            dob: z.string().nullable(),
            profile_image: z.string().nullable(),
          })
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
          id: z.string(),
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
          id: z.string(),
          name: z.string(),
          species: z.object({
            id: z.number(),
            name: z.string(),
          }),
          breed: z.object({
            id: z.number(),
            name: z.string(),
          }).nullable(),
          weight: z.number().nullable(),
          gender: z.object({
            id: z.number(),
            name: z.string(),
          }).nullable(),
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
      path: "/appointmenttypes",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        appointmentTypes: z.array(z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          vetPortId: z.number(),
          isGrooming: z.boolean(),
          subtypes: z.array(z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
          })).optional(),
        }))
      }),
      errorResponseSchema: z.object({}),
    },

    getClinics: {
      method: "GET",
      path: "/clinics",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({
        clinics: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            services: z.string(),
            image: z.string(),
            location: z.string(),
          })
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
          })
        ),
      }),
      errorResponseSchema: z.object({}),
    },

    getDoctorsForClinic: {
      method: "GET",
      path: "/clinic/{clinicid}/staff",
      pathParamsSchema: z.object({ clinicid: z.number() }),
      requestSchema: z.object({}),
      responseSchema: z.object({
        staff: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            image: z.string(),
            clinicids: z.array(z.number()),
          })
        ),
      }),
      errorResponseSchema: z.object({}),
    }
  },
});
