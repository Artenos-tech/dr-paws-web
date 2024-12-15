"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { AppointmentType } from "@/model/typeDefinitions";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import { useUserContext, Pet } from "@/context/UserContext";

export interface AppointmentsContextType {
  appointments: AppointmentType[] | null;
  loading: boolean;
  fetchAppointments: () => void;
}

export const AppointmentsContext = createContext<AppointmentsContextType | undefined>(
  undefined
);

interface AppointmentsProviderProps {
  children: ReactNode;
}

export const AppointmentsProvider = ({ children }: AppointmentsProviderProps) => {
  const [appointments, setAppointments] = useState<AppointmentType[] | null>(null);
  const [loading, setLoading] = useState(false);

  const { call: getAppointments } = useAPICall(api.getAppointments);
  const { user, refresh } = useUserContext();

  const fetchAppointments = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await getAppointments({});
      if (result.ok) {
        setAppointments(result.value.body.appointments);
      }
    } catch (err) {
      console.error(err); 
    } finally {
      setLoading(false);
    }
  }, [getAppointments, user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments(); 
    }
  }, [user?.id, refresh]);


  return (
    <AppointmentsContext.Provider
      value={{ 
        appointments, 
        loading, 
        fetchAppointments,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointmentsContext = () => {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error(
      "useAppointmentsContext must be used within an AppointmentsProvider"
    );
  }
  return context;
};
