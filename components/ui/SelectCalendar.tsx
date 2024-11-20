"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isToday,
} from "date-fns";

interface CalendarProps {
  timezone?: string;
}

const SelectCalendar: React.FC<CalendarProps> = ({
  timezone = "India Standard Time (2:30pm)",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));

  const days = [];
  let day = startDate;

  // Generate days for the calendar grid
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Handle month navigation
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Handle date selection
  const selectDate = (date: Date) => {
    if (date.getMonth() === currentDate.getMonth()) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="max-w-sm bg-primary-3 rounded-lg shadow-md p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div
          onClick={prevMonth}
          className="cursor-pointer text-gray-500"
        >
          <ChevronLeft />
        </div>
        <div className="text-lg text-center flex-1">
          {format(currentDate, "MMMM yyyy")}
        </div>
        <div
          onClick={nextMonth}
          className="cursor-pointer text-gray-500"
        >
          <ChevronRight />
        </div>
      </div>

      {/* Days of the week */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, index) => (
          <div key={index} className="font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 text-center">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <div
              key={index}
              onClick={isCurrentMonth ? () => selectDate(date) : undefined}
              className={`p-2 text-md rounded-sm ${
                isSelected
                  ? "bg-secondary-1 text-white"
                  : isToday(date)
                  ? "border border-secondary-1 text-black"
                  : isCurrentMonth
                  ? "text-black cursor-pointer  "
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Timezone display */}
      <div className="pl-4 text-sm text-gray-500 mt-4 flex flex-col items-start">
        <div className="">Time Zone</div>
        <div className="flex gap-1">🌍 {timezone}</div>
      </div>
    </div>
  );
};

export default SelectCalendar;
