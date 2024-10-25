"use client";
import { useState } from "react";
import { tabs } from "../../model/mockData";

type TabName = keyof typeof tabs;

const ServicePageTab = () => {
  const [activeTab, setActiveTab] = useState<TabName>("Planned check-ups");

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="relative">
        {/* Thicker base line that runs across all tabs */}
        <div className="absolute bottom-0 left-0 w-full h-[6px] bg-neutral-100"></div>

        <div className="flex items-center justify-center space-x-8 pb-2">
          {Object.keys(tabs).map((tab) => (
            <button
              key={tab}
              className={`relative text-sm font-semibold ${
                activeTab === tab
                  ? "text-primary-1"
                  : "text-primary-1 font-normal"
              }`}
              onClick={() => setActiveTab(tab as TabName)}
              style={{ paddingBottom: "10px" }} // Add padding to account for the underline
            >
              {tab}
              {activeTab === tab && (
                // Underline that overlaps the thicker base line
                <span
                  className="absolute left-0 bottom-0 w-full h-[6px] bg-secondary-1"
                  style={{ bottom: "-6px" }} // Ensure it's placed just on top of the base line
                ></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 text-center text-neutral-600">
        <p className="max-w-lg mx-auto">{tabs[activeTab]}</p>
      </div>
    </div>
  );
};

export default ServicePageTab;
