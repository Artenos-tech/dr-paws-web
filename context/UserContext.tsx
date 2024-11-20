"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "ADMIN" | "USER";
export type Gender = "Male" | "Female";

export interface User {
  id: string;
  mobile: string;
  name: string;
  role: UserRole;
  email: string | null;
  currentAddress: string | null;
  profilePicture: string | undefined; // profile picture is optional
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  weight: number | null;
  gender: Gender;
  dob: string | null;
  petImage: string | undefined; // pet image is optional
}

export interface UserContextType {
  user: User | null;
  userPets: Pet[] | null;
  updateUserDetailsHandler: (data: Partial<User>) => void;
  updateUserPetsHandler: (data: Partial<Pet>[]) => void;
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

  const updateUserDetailsHandler = (data: Partial<User>) => {
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
          profilePicture: data.profilePicture,
        };
      }

      // Merge data into existing details
      return {
        ...prevDetails,
        ...data,
      };
    });
  };

  const updateUserPetsHandler = (updatedPets: Partial<Pet>[]) => {
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
          petImage: updatedPet.petImage,
        }));
      }

      return prevPets.map((pet) => {
        const updatedPet = updatedPets.find((updated) => updated.id === pet.id);
        return updatedPet ? { ...pet, ...updatedPet } : pet;
      });
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userPets,
        updateUserDetailsHandler,
        updateUserPetsHandler,
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
