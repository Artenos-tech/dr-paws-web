"use client"

import { useRouter } from "next/navigation"
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import UserAuthenticationModal from "@/components/ui/UserAuthenticationModal"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"

export type UserRole = "ADMIN" | "USER"

export interface User {
  id: string
  mobile: string
  name: string
  role?: UserRole
  email: string | null
  address1: string | null
  address2: string | null
  city: string | null
  state: string | null
  country: string | null
  pincode: string | null
  profile_image: string | null
}

export interface Pet {
  id: string
  name: string
  type: "DOG" | "CAT" | "OTHER" | null
  breedId: string | null
  breed: string | null
  // weight: string | null
  gender: "MALE" | "FEMALE" | null
  dob: string | null
  // age: {
  //   years: number | null;
  //   months: number | null;
  // };
  profileImage: string | null // pet image is optional
}

export interface UserContextType {
  user: User | null
  petSpecies: Array<"DOG" | "CAT" | "OTHER"> | null
  petGenders: Array<"MALE" | "FEMALE"> | null
  isLoggedIn: boolean | null
  updateUserDetailsHandler: (data: User) => void
  getAuthToken: () => string | null
  refresh: () => void
  updatePetSpeciesHandler: (data: Array<"DOG" | "CAT" | "OTHER">) => void
  updatePetGendersHandler: (data: Array<"MALE" | "FEMALE">) => void
  initiateLogin: (loginText: string, redirectTo: string) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [petSpecies, setPetSpecies] = useState<Array<
    "DOG" | "CAT" | "OTHER"
  > | null>(null)
  const [petGenders, setPetGenders] = useState<Array<"MALE" | "FEMALE"> | null>(
    null,
  )

  const { call: getUser } = useAPICall(api.getUser)
  const { call: getUser2 } = useAPICall(api.getUser)

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken")
      return token
    }
    return null
  }, [])

  const handleCheckAuthToken = useCallback(async () => {
    const token = getAuthToken()
    if (token) {
      if (!user) {
        try {
          const response = await getUser({})
          if (response.ok) {
            const userResponse = response.value.body.user
            setUser(userResponse)
          }
        } catch (error) {
          console.error(error)
        }
      }
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  async function checkIsLoggedIn() {
    const response = await getUser2({})
    if (response.ok) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }

  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)
  const [loginText, setLoginText] = useState<string>("")
  const [redirectTo, setRedirectTo] = useState<string | null>(null)
  const router = useRouter()

  function initiateLogin(loginText: string, redirectToPath: string) {
    setLoginModalOpen(true)
    setLoginText(loginText)
    setRedirectTo(redirectToPath)
  }

  async function handleLoginSuccess() {
    setLoginModalOpen(false)
    await checkIsLoggedIn()
    if (redirectTo) {
      router.push(redirectTo)
      setRedirectTo(null)
    } else {
      router.push("/user/book-appointment")
    }
    // TODO: toast.success(loginSuccessMsg);
  }

  useEffect(() => {
    handleCheckAuthToken()
  }, [handleCheckAuthToken])

  useEffect(() => {
    checkIsLoggedIn()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        petSpecies,
        petGenders,
        isLoggedIn,
        updateUserDetailsHandler: setUser,
        updatePetSpeciesHandler: setPetSpecies,
        updatePetGendersHandler: setPetGenders,
        getAuthToken,
        refresh: handleCheckAuthToken,
        initiateLogin,
      }}
    >
      {loginModalOpen && (
        <UserAuthenticationModal
          isOpen
          onClose={() => setLoginModalOpen(false)}
          buttonText={loginText}
          onSuccess={handleLoginSuccess}
        />
      )}
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}
