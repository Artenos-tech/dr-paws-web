"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronDown } from "lucide-react";

interface ImageDetail {
  img: StaticImageData | string;
  imgText: string;
}

interface Tab {
  id: string;
  title: string;
  description: string;
  imageDetails: ImageDetail[];
}

type ServiceTabProps = {
  tabs: Tab[];
};

const ServiceTab = ({ tabs }: ServiceTabProps) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);
  const activeTabTitle = tabs.find((tab) => tab.id === activeTab)?.title;

  const getGridLayout = (imageCount: number) => {
    switch (imageCount) {
      case 2:
        return "grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto";
      case 3:
        return "grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto";
      case 4:
        return "grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto";
      case 5:
        return "grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto";
      case 6:
        return "grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto";
      case 8:
        return "grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 gap-6 md:gap-8";
      default:
        return "grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto";
    }
  };

  const getItemLayout = (imageCount: number, index: number) => {
    if (imageCount === 5) {
      // First row: 3 images spread out
      if (index < 3) {
        return `sm:col-span-2`;
      }
      // Second row: 2 images centered in the gaps
      return `sm:col-start-${2 + (index - 3) * 2} sm:col-span-2`;
    }
    return "";
  };

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
                  setActiveTab(tab.id);
                  setIsDropdownOpen(false);
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
        <div className="sm:space-y-12 md:space-y-20 px-4">
          {/* Description */}
          <p className="text-center text-primary-1 max-w-3xl mx-auto text-lg">
            {activeTabContent.description}
          </p>

          {/* Image Grid */}
          <div className={getGridLayout(activeTabContent.imageDetails.length)}>
            {activeTabContent.imageDetails.map((detail, index) => (
              <div
                key={index}
                className={`flex flex-col items-center space-y-4 ${getItemLayout(
                  activeTabContent.imageDetails.length,
                  index
                )}`}
              >
                <div className="rounded-full overflow-hidden w-[120px] h-[120px] sm:w-[165px] sm:h-[165px] flex-shrink-0">
                  <Image
                    src={detail.img}
                    alt={detail.imgText}
                    className="object-cover w-full h-full"
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
  );
};

export default ServiceTab;
