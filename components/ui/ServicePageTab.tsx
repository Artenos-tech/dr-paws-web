"use client"

import { useState } from "react"
import Image, { StaticImageData } from "next/image"
import { ChevronDown } from "lucide-react"

interface ImageDetail {
  img: StaticImageData | string
  imgText: string
}

interface Tab {
  id: string
  title: string
  description: string
  imageDetails: ImageDetail[]
}

type ServiceTabProps = {
  tabs: Tab[]
}

const ServiceTab = ({ tabs }: ServiceTabProps) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)
  const activeTabTitle = tabs.find((tab) => tab.id === activeTab)?.title

  return (
    <div className="w-full mx-auto">
      {/* Tabs Navigation - Desktop */}
      <div className="relative mb-16 hidden xl:block">
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-primary-3"></div>
        <div className="flex items-center justify-between space-x-[28px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`relative py-2 text-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "font-semibold text-primary-1"
                  : "text-primary-1"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
              {activeTab === tab.id && (
                <span className="absolute left-0 bottom-0 w-full h-1.5 bg-secondary-2"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown - Mobile */}
      <div className="xl:hidden relative mb-12">
        <button
          className="w-full px-4 py-3 bg-white border rounded-lg shadow-sm flex items-center justify-between text-primary-1"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="text-lg">{activeTabTitle}</span>
          <ChevronDown
            className={`transform transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                  activeTab === tab.id ? "font-semibold bg-gray-50" : ""
                }`}
                onClick={() => {
                  setActiveTab(tab.id)
                  setIsDropdownOpen(false)
                }}
              >
                {tab.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content */}
      {activeTabContent && (
        <div className="sm:space-y-12  px-4">
          <p className="text-center text-primary-1 max-w-3xl mx-auto text-lg">
            {activeTabContent.description}
          </p>

          {/* Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 xl:grid-cols-4 2xl:grid-cols-5 justify-between  md:gap-6 w-full mx-auto">
            {activeTabContent.imageDetails.map((detail, index) => (
              <div
                key={index}
                className={`flex flex-col items-center space-y-4 `}
              >
                <div className="mt-6 md:mt-0 rounded-full overflow-hidden max-w-[120px] max-h-[120px] md:max-w-[150px] md:max-h-[150px] lg:max-w-[165px] lg:max-h-[165px] flex-shrink-0">
                  <Image
                    src={detail.img}
                    alt={detail.imgText}
                    className="object-cover w-[120px] h-[120px] md:w-[150px] md:h-[150px] lg:w-[165px] lg:h-[165px]"
                    width={165}
                    height={165}
                    unoptimized={typeof detail.img === "string"}
                  />
                </div>
                <span className="text-center text-primary-1 text-lg sm:text-xl font-medium">
                  {detail.imgText}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceTab
