"use client"

import { Autocomplete } from "@react-google-maps/api"
import { Search } from "lucide-react"
import { GrClose } from "react-icons/gr"

type MapSearchBarProps = {
  showSearch: boolean
  setShowSearch: (val: boolean) => void
  searchText: string
  setSearchText: (val: string) => void
  setAutocomplete: (auto: google.maps.places.Autocomplete) => void
  onPlaceChanged: () => void
}

const MapSearchBar = ({
  showSearch,
  setShowSearch,
  searchText,
  setSearchText,
  setAutocomplete,
  onPlaceChanged,
}: MapSearchBarProps) => {
  return (
    <div className="relative w-full">
      {!showSearch && (
        <button
          onClick={() => setShowSearch(true)}
          className="absolute top-2 right-14 md:right-16 z-20 rounded-full bg-white p-2 shadow-md lg:hidden"
        >
          <Search />
        </button>
      )}

      <div className="absolute top-2 left-1/2 z-20 w-[60%] -translate-x-1/2">
        <div className={`${showSearch ? "block" : "hidden"} lg:block`}>
          <Autocomplete
            onLoad={setAutocomplete}
            onPlaceChanged={onPlaceChanged}
          >
            <div className="relative">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                placeholder="Search for your area, street, or landmark"
                className="w-full rounded-full border px-4 py-2 pr-10 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary-1 bg-white"
              />

              <button
                onClick={() => {
                  if (searchText) setSearchText("")
                  else setShowSearch(false)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <GrClose />
              </button>
            </div>
          </Autocomplete>
        </div>
      </div>
    </div>
  )
}

export default MapSearchBar
