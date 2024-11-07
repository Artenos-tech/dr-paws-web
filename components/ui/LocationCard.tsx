"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as { _getIconUrl?: () => void })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LOCATION = {
  lat: 12.9725533,
  lng: 77.6397607,
};

export const LocationCard: React.FC = () => {
  const getDirections = () => {
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
      // Geolocation not available
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${LOCATION.lat},${LOCATION.lng}`,
        "_blank"
      );
    }
  };

  return (
    <div className="rounded-lg p-[35px] w-full lg:w-[400px] lg:h-[440px] flex flex-col border border-[#74A7B3]">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 font-roca">
        Location
      </h2>
      <div className="mb-4 rounded-lg h-64 lg:h-auto lg:flex-1">
        {/* Applied 'md:flex-1' to make it expand on medium and larger screens */}
        <MapContainer
          center={[LOCATION.lat, LOCATION.lng]}
          zoom={15}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[LOCATION.lat, LOCATION.lng]}>
            <Popup>Om Heera Panna Mall</Popup>
          </Marker>
        </MapContainer>
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
};
