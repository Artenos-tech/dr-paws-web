"use client";

import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

interface LocationCardProps {
  locationString: string;
}

export function LocationCard({ locationString }: LocationCardProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const extractCoordinates = async (url: string) => {
      try {
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = url.match(regex);

        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);

          setLocation({ lat, lng });

          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          if (!apiKey) {
            throw new Error("Google Maps API key is not set");
          }

          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
          const response = await fetch(geocodeUrl);
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            setAddress(data.results[0].formatted_address);
          } else {
            throw new Error("No address found for the given coordinates");
          }
        } else {
          throw new Error("Invalid location string");
        }
      } catch (error) {
        console.error("Error extracting coordinates:", error);
      }
    };

    if (locationString) {
      extractCoordinates(locationString);
    }
  }, [locationString]);

  const getDirections = () => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="rounded-lg p-[35px] w-full lg:w-[400px] lg:h-[440px] flex flex-col border border-[#74A7B3]">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 font-roca">
        Location
      </h2>
      <div className="mb-4 rounded-lg h-64 lg:h-auto lg:flex-1">
        {location ? (
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: location.lat, lng: location.lng }}
              zoom={15}
            >
              <Marker
                position={{ lat: location.lat, lng: location.lng }}
                label="Dr. Paws"
              />
            </GoogleMap>
          </LoadScript>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
            Loading Map...
          </div>
        )}
      </div>
      <div className="flex items-start mb-4 ">
        <div className="flex-1">
          <MapPin
            className="h-5 w-5 mr-2 mt-1 text-gray-500"
            aria-hidden="true"
          />
        </div>
        <p className="text-gray-600 font-roca">
          {address || "Loading address..."}
        </p>
      </div>
      <button
        onClick={getDirections}
        className="bg-[#5281A2] text-white w-[175px] h-[40px] py-2 px-4 rounded-[20px] hover:bg-[#1e6ea6] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Get directions to the clinic location"
        disabled={!location}
      >
        Get Directions
      </button>
    </div>
  );
}
