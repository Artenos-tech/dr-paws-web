"use client";
import { useState } from "react";

interface Tab {
  id?: string;
  title: string;
  component: JSX.Element;
}

type ClinicTabBarProps = {
  tabs: Tab[];
};

const ClinicTabBar = ({ tabs }: ClinicTabBarProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    tabs[0].id || tabs[0].title
  );

  return (
    <div className="w-full m-auto min-h-[200px]">
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-full h-[6px] bg-primary-3"></div>
        <div className="pb-2 overflow-x-auto">
          <div className="flex items-center space-x-8 justify-start">
            {tabs.map((tab) => (
              <button
                key={tab.id || tab.title}
                className={`relative text-lg whitespace-nowrap ${
                  activeTab === (tab.id || tab.title)
                    ? "text-primary-1 font-semibold"
                    : "text-primary-1 font-normal"
                }`}
                onClick={() => setActiveTab(tab.id || tab.title)}
              >
                {tab.title}
                {activeTab === (tab.id || tab.title) && (
                  <span
                    className="absolute left-0 bottom-0 w-full h-[6px] bg-secondary-1"
                    style={{ transform: "translateY(8px)" }}
                  ></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 text-neutral-600">
        <div className="w-full">
          {tabs.find((tab) => (tab.id || tab.title) === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default ClinicTabBar;
