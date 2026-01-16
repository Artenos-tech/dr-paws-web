"use client"

import { GoogleMap, Marker } from "@react-google-maps/api"

type AddressMapProps = {
  pin: google.maps.LatLngLiteral
  setLocation: (e: google.maps.MapMouseEvent) => void
  mapOptions: google.maps.MapOptions
}

const AddressMap = ({ pin, setLocation, mapOptions }: AddressMapProps) => {
  return (
    <GoogleMap
      center={pin}
      zoom={15}
      mapContainerStyle={{ width: "100%", height: "400px" }}
      onClick={setLocation}
      options={mapOptions}
    >
      <Marker draggable position={pin} onDragEnd={setLocation} />
    </GoogleMap>
  )
}

export default AddressMap
