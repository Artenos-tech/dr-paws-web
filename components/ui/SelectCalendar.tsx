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
  isBefore,
  startOfDay,
} from "date-fns";

interface CalendarProps {
  timezone?: string;
  onDateSelect: (date: Date) => void; // Callback for date selection
  selectedDate: Date | null;
  years: Record<string, string>;
}

const SelectCalendar: React.FC<CalendarProps> = ({
  timezone = "India Standard Time (2:30pm)",
  onDateSelect,
  selectedDate,
  years,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = startOfDay(new Date());
  const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }); 
  const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const isDateDisabled = (date: Date) => {
    const monthName = format(date, "MMMM");
    const dateNumber = date.getDate();
    const monthDates = years[monthName]?.split(",").map(Number) || [];
    return !monthDates.includes(dateNumber);
  };

  const selectDate = (date: Date) => {
    if (date.getMonth() === currentDate.getMonth() && !isBefore(date, today)) {
      console.log("date,", date); // if I select MON in calender, it giving response of sunday
      onDateSelect(date);
    }
  };

  return (
    <div className="bg-primary-3 rounded-lg shadow-md p-4 md:p-8 max-w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sm:mb-4">
        <div onClick={prevMonth} className="cursor-pointer text-gray-500">
          <ChevronLeft />
        </div>
        <div className="text-lg text-center flex-1 sm:text-base">
          {format(currentDate, "MMMM yyyy")}
        </div>
        <div onClick={nextMonth} className="cursor-pointer text-gray-500">
          <ChevronRight />
        </div>
      </div>

      {/* Days of the week */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2 sm:mb-1">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, index) => (
          <div
            key={index}
            className="font-medium p-1 sm:p-0 text-xs sm:text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 text-center gap-1 sm:gap-0.5">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isPast = isBefore(date, today);
          const disabled = isCurrentMonth && isDateDisabled(date);

          return (
            <div
              key={index}
              onClick={
                isCurrentMonth && !isPast && !disabled
                  ? () => selectDate(date)
                  : undefined
              }
              className={`p-2 text-md sm:text-sm rounded-sm ${
                isSelected
                  ? "bg-secondary-1 text-white"
                  : isToday(date)
                  ? "border border-secondary-1 text-black"
                  : isCurrentMonth && !isPast && !disabled
                  ? "text-black cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Timezone display */}
      <div className="pl-4 text-sm text-gray-500 mt-8 sm:mt-4 flex flex-col items-start">
        <div>Time Zone</div>
        <div className="flex gap-1">🌍 {timezone}</div>
      </div>
    </div>
  );
};

export default SelectCalendar;
