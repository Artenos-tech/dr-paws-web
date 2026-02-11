"use client"

import { useEffect, useState } from "react"

type ClinicTabBarProps<T extends string> = {
  tabs: {
    [key: string]: {
      label: string
      component?: JSX.Element
    }
  }
  activeTabId: T
  onTabChange?: (tabId: T) => void
}

function ClinicTabBar<T extends string>({
  tabs,
  activeTabId,
  onTabChange,
}: ClinicTabBarProps<T>) {
  const [isMobileView, setIsMobileView] = useState(false)

  const handleTabClick = (tabId: string) => {
    if (onTabChange) onTabChange(tabId as T)
  }

  useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 400)
    }

    checkViewport()
    window.addEventListener("resize", checkViewport)
    return () => window.removeEventListener("resize", checkViewport)
  }, [])

  const tabEntries = Object.entries(tabs)

  return (
    <div className="w-full m-auto">
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-full h-[6px] bg-primary-3"></div>
        {isMobileView ? (
          // Dropdown version
          <div className="pb-2">
            <select
              className="text-lg text-primary-1 w-full text-center font-semibold border border-gray-300 rounded px-4 py-2 bg-white"
              value={activeTabId}
              onChange={(e) => handleTabClick(e.target.value)}
            >
              {tabEntries.map(([id, tab]) => (
                <option key={id} value={id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          // Horizontal tab version
          <div className="pb-2 overflow-x-auto">
            <div className="flex items-center space-x-8 justify-start">
              {tabEntries.map(([id, tab]) => {
                const isActive = activeTabId === id

                return (
                  <button
                    key={id}
                    onClick={() => handleTabClick(id)}
                    className={`
        group relative text-lg whitespace-nowrap
        transition-all duration-200
        ${
          isActive
            ? "text-primary-1 font-semibold"
            : "text-primary-1/70 hover:text-primary-1"
        }
        active:scale-[0.97]
      `}
                  >
                    {tab.label}

                    {/* Underline */}
                    <span
                      className={`
          absolute left-0 bottom-0 h-[6px] w-full
          transition-all duration-200 translate-y-2
          ${
            isActive
              ? "bg-secondary-1 opacity-100"
              : "bg-secondary-1 opacity-0 group-hover:opacity-60"
          }
        `}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClinicTabBar
