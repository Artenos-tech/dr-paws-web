"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const LOCATION = {
  lat: 12.9725533,
  lng: 77.6397607,
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = LOCATION;

export function LocationCard() {
  const getDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${LOCATION.lat},${LOCATION.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-lg p-[35px] w-full lg:w-[400px] lg:h-[440px] flex flex-col border border-[#74A7B3]">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 font-roca">
        Location
      </h2>
      <div className="mb-4 rounded-lg h-64 lg:h-auto lg:flex-1">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
          >
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="flex items-start mb-4 ">
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
}
