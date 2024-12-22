"use client";

interface Tab {
  label: string;
}

type ClinicTabBarProps<T extends string> = {
  tabs: Record<T, Tab>;
  activeTabId: T;
  onTabChange?: (tabId: T) => void;
};

function ClinicTabBar<T extends string>({ tabs, activeTabId, onTabChange }: ClinicTabBarProps<T>) {

  const handleTabClick = (tabId: string) => {
    onTabChange && onTabChange(tabId as T);
  }

  return (
    <div className="w-full m-auto">
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-full h-[6px] bg-primary-3"></div>
        <div className="pb-2 overflow-x-auto">
          <div className="flex items-center space-x-8 justify-start">
            {Object.entries(tabs).map(([id, tab]) => (
              <button
                key={id}
                className={`relative text-lg whitespace-nowrap ${
                  activeTabId === id
                    ? "text-primary-1 font-semibold"
                    : "text-primary-1 font-normal"
                }`}
                onClick={() => handleTabClick(id)}
              >
                {(tab as Tab).label}
                {activeTabId === id && (
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
    </div>
  );
};

export default ClinicTabBar;
