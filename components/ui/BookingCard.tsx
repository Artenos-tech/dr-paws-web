"use client";

interface BookingCardProps {
  title: string;
  description: string;
  isChecked: boolean;
  onToggle: () => void;
}

export default function BookingCard({ title, description, isChecked, onToggle }: BookingCardProps) {
  return (
    <div className="w-full bg-[#fdf7f2] rounded-md p-4 transition-colors duration-200 group relative">
      <div className="flex justify-between items-start">
        <div 
          className="flex-1 space-y-1 cursor-pointer" 
          onClick={onToggle}
        >
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <label className="relative flex items-start">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={onToggle}
            className="w-6 h-6 rounded-md border-2 border-gray-300 text-secondary-1 focus:ring-secondary-1 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}