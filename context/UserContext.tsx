"use client";

import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import jwt from "jsonwebtoken";
import { z } from "zod";

export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  mobile: string;
  name: string;
  role: UserRole;
  email: string | null;
  currentAddress: string | null;
  profileImage: string | null;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  weight: string | null;
  gender: string | null;
  dob: string | null;
  // age: {
  //   years: number | null;
  //   months: number | null;
  // };
  vetPortId: number | null;
  profileImage: string | null; // pet image is optional
}

export interface PetSpecies {
  id: number;
  name: string;
}

export interface UserContextType {
  user: User | null;
  userPets: Pet[] | null;
  petSpecies: PetSpecies[] | null;
  updateUserDetailsHandler: (data: Partial<User>) => void;
  updateUserPetsHandler: (data: Partial<Pet>[]) => void;
  getAuthToken: () => string | null;
  refresh: () => void;
  updatePetSpeciesHandler: (data: PetSpecies[]) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPets, setUserPets] = useState<Pet[] | null>(null);
  const [petSpecies, setPetSpecies] = useState<PetSpecies[] | null>(null);

  const { call: getUser } = useAPICall(api.getuser);

  const JwtPayloadSchema = z.object({
    id: z.string(),
  });

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      return token;
    }
    return null;
  }, []);

  const updateUserDetailsHandler = useCallback((data: Partial<User>) => {
    setUser((prevDetails) => {
      if (!prevDetails) {
        // If no previous details exist, initialize a new user object with defaults
        return {
          id: data.id || "",
          mobile: data.mobile || "",
          name: data.name || "",
          role: data.role || "USER",
          email: data.email || null,
          currentAddress: data.currentAddress || null,
          profileImage: data.profileImage || null,
        };
      }

      // Merge data into existing details
      return {
        ...prevDetails,
        ...data,
      };
    });
  }, []);

  const updateUserPetsHandler = useCallback((updatedPets: Partial<Pet>[]) => {
    setUserPets((prevPets) => {
      if (!prevPets || prevPets.length === 0) {
        return updatedPets.map((updatedPet) => ({
          id: updatedPet.id || "",
          name: updatedPet.name || "",
          type: updatedPet.type || "",
          breed: updatedPet.breed || null,
          weight: updatedPet.weight || null,
          gender: updatedPet.gender || "Male",
          dob: updatedPet.dob || null,
          // age: {
          //   years: updatedPet.age?.years || null,
          //   months: updatedPet.age?.months || null,
          // },
          vetPortId: updatedPet.vetPortId || null,
          profileImage: updatedPet.profileImage || null,
        }));
      }

      return prevPets.map((pet) => {
        const updatedPet = updatedPets.find((updated) => updated.id === pet.id);
        return updatedPet ? { ...pet, ...updatedPet } : pet;
      });
    });
  }, []);

  const updatePetSpeciesHandler = (data: Partial<PetSpecies>[]) => {
  setPetSpecies((prevSpecies) => {
    if (!prevSpecies || prevSpecies.length === 0) {
      return data
        .filter((species) => species.id !== undefined && species.name !== undefined) // Ensure valid data
        .map((species) => ({
          id: species.id as number, // Cast since we ensured validity above
          name: species.name as string,
        }));
    }

    return prevSpecies.map((species) => {
      const updatedPetSpecies = data.find(
        (updated) => updated.id === species.id
      );
      return updatedPetSpecies
        ? {
            id: species.id,
            name: updatedPetSpecies.name ?? species.name, // Fallback to the original name
          }
        : species;
    });
  });
};


  const handleCheckAuthToken = useCallback(async () => {
    const token = getAuthToken();
    if (token) {
      const decodedToken = jwt.decode(token);
      const payload = JwtPayloadSchema.parse(decodedToken);
      if (!user) {
        try {
          const response = await getUser({ id: payload.id });
          if (response.ok) {
            const userResponse = response.value.body.user;
            updateUserDetailsHandler(userResponse);
            const pets = response.value.body.pets?.map((pet) => ({
              ...pet,
              profileImage: pet.profile_image,
              gender: pet.gender,
            })) as Partial<Pet>[];

            if (pets) {
              updateUserPetsHandler(pets);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, []);

  useEffect(() => {
    handleCheckAuthToken();
  }, [handleCheckAuthToken]);

  return (
    <UserContext.Provider
      value={{
        user,
        userPets,
        petSpecies,
        updateUserDetailsHandler,
        updateUserPetsHandler,
        getAuthToken,
        refresh: handleCheckAuthToken,
        updatePetSpeciesHandler,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
