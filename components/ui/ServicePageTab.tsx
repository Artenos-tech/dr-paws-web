import { useState } from "react";
import { ServiceTabsData } from "@/model/mockData";
import Image, { StaticImageData } from "next/image";

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

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Tabs Navigation */}
      <div className="relative mb-12">
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-primary-3"></div>
        {/* Make the container horizontally scrollable */}
        <div className="overflow-x-auto scrollbar-hide pb-1.5">
          {/* Force the tabs to be full width on mobile and center them */}
          <div className="flex items-center min-w-full md:min-w-0 md:w-max mx-auto px-4">
            <div className="flex items-center space-x-8 mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`relative flex-shrink-0 px-4 py-2 text-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? " font-semibold text-primary-1"
                      : "text-primary-1 "
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.title}
                  {activeTab === tab.id && (
                    <span className="absolute left-0 bottom-0 w-full h-1.5 bg-secondary-2 transform translate-y-1.5"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTabContent && (
        <div className="space-y-8 px-4">
          {/* Description */}
          <p className="text-center text-primary-1 max-w-3xl mx-auto text-lg">
            {activeTabContent.description}
          </p>

          {/* Image Grid - Make container scrollable on mobile */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 min-w-[600px]">
              {activeTabContent.imageDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-4"
                >
                  <div className="rounded-full overflow-hidden w-[165px] h-[165px] flex-shrink-0">
                    <Image
                      src={detail.img}
                      alt={detail.imgText}
                      className="object-cover w-full h-full"
                      width={165}
                      height={165}
                      unoptimized={typeof detail.img === "string"}
                    />
                  </div>
                  <span className="text-center text-primary-1 text-xl font-medium">
                    {detail.imgText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTab;
