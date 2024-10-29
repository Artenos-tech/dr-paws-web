import { photos } from '@/model/mockData'
import React from 'react'

function ClinicGallery() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
          {photos.map((image) => (
            <div
              // key={image.id}
              className={`relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02] group`}
            >
              <img
                src={image.src}
                alt={"gallery image"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-gray-100 transition-colors">
                    <span>View Gallery</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

  )
}

export default ClinicGallery