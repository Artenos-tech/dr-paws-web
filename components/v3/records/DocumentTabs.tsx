"use client"

import { useState } from "react"
import type { V3DocumentCounts, V3DocumentType } from "@/services/api.v3"
import DocumentList from "./DocumentList"

export type TabDef = {
  type: V3DocumentType
  label: string
  countKey: keyof V3DocumentCounts
}

interface Props {
  tabs: TabDef[]
  counts: V3DocumentCounts | null
  petId?: string
}

export default function DocumentTabs({ tabs, counts, petId }: Props) {
  const [activeType, setActiveType] = useState<V3DocumentType>(tabs[0].type)

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-5 border-b border-gray-200 -mx-4 px-4">
        {tabs.map((tab) => {
          const count = counts ? counts[tab.countKey] : null
          const isActive = activeType === tab.type
          return (
            <button
              key={tab.type}
              onClick={() => setActiveType(tab.type)}
              className={[
                "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary-2 text-primary-1"
                  : "border-transparent text-gray-500 hover:text-primary-1 hover:border-gray-300",
              ].join(" ")}
            >
              {tab.label}
              {count != null && count > 0 && (
                <span
                  className={[
                    "inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold px-1",
                    isActive
                      ? "bg-primary-2 text-white"
                      : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active tab content */}
      <DocumentList type={activeType} petId={petId} />
    </div>
  )
}
