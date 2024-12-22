import React, { useState } from 'react';
import { BookingCategory } from './SelectService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: Record<number, string | null>) => void;
  subtypes: BookingCategory[];
}

export default function BookingModal({ isOpen, onClose, onSelect, subtypes }: BookingModalProps) {
  const [selectedOption, setSelectedOption] = useState<Record<number, string | null>>({});

  const handleSelect = () => {
    if (selectedOption) {
      onSelect(selectedOption);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <div className="p-4 sm:p-6 flex flex-col items-center justify-between gap-4 sm:gap-6">
          <h2 className="text-xl sm:text-2xl mb-2 sm:mb-4">Select type of Grooming</h2>
          
          <div className="w-full space-y-3 sm:space-y-4">
            {subtypes.map((subtype) => (
              <label key={subtype.id} className="flex items-center space-x-2 border p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="service"
                  value={subtype.id}
                  checked={Object.keys(selectedOption)[0] === subtype.id}
                  onChange={() => setSelectedOption({ [subtype.id]: subtype.title })}
                  className="form-radio h-4 w-4 sm:h-5 sm:w-5 text-[#5281a2] focus:ring-[#5281a2] cursor-pointer"
                />
                <span className="flex-grow">
                  <span className="font-semibold text-sm sm:text-base">{subtype.title}</span>
                  <span className="block text-xs sm:text-sm text-gray-500">{subtype.description}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-between w-full mt-4 sm:mt-6 space-x-3">
            <button 
              onClick={onClose}
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-[#5281a2] border border-[#5281a2] hover:bg-[#5281a2] hover:text-white transition-colors text-sm sm:text-base flex-1"
            >
              Cancel
            </button>
            <button 
              onClick={handleSelect}
              disabled={!selectedOption}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-white text-sm sm:text-base flex-1 ${
                selectedOption ? 'bg-[#5281a2] hover:bg-[#3a6d8e]' : 'bg-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
