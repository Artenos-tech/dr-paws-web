"use client";

import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const LOCATION = {
  lat: 12.9725533,
  lng: 77.6397607,
};

const Map = dynamic(
  () => {
    return import("./MapWrapper").then((mod) => mod.MapWrapper);
  },
  {
    loading: () => (
      <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />
    ),
    ssr: false,
  }
);

export const LocationCard: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getDirections = () => {
    if (typeof window === "undefined") return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${LOCATION.lat},${LOCATION.lng}`;
          window.open(url, "_blank");
        },
        (error) => {
          console.error("Error getting location:", error);
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${LOCATION.lat},${LOCATION.lng}`,
            "_blank"
          );
        }
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${LOCATION.lat},${LOCATION.lng}`,
        "_blank"
      );
    }
  };

  return (
    <div className="rounded-lg p-[35px] w-full md:w-[400px] md:h-[440px] flex flex-col border border-[#74A7B3]">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 font-roca">
        Location
      </h2>
      <div className="mb-4 rounded-lg h-64 md:h-auto md:flex-1">
        {isMounted && <Map location={LOCATION} />}
      </div>
      <div className="flex items-start mb-4">
        <MapPin className="h-5 w-5 mr-2 mt-1 text-gray-500" />
        <p className="text-gray-600 font-roca">
          7th Main 4th Cross, Bengaluru, Karnataka 560038
        </p>
      </div>
      <button
        onClick={getDirections}
        className="bg-[#5281A2] text-white w-[175px] h-[40px] py-2 px-4 rounded-[20px] hover:bg-[#1e6ea6] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Get directions to Om Heera Panna Mall"
      >
        Get Directions
      </button>
    </div>
  );
};
