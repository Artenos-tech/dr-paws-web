"use client";

import BookingCard from '@/components/ui/BookingCard';
import BookingModal from '@/components/ui/BookingModal';
import { bookingCategories } from '@/model/mockData';
import { useState } from 'react';


export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    setIsModalOpen(true);
  };

  const handleModalNext = () => {
    setIsModalOpen(false);
    setShowSummary(true);
  };

  const selectedItems = bookingCategories.filter(category => 
    selectedCategories.has(category.id)
  );

  if (showSummary) {
    return (
      <main className="min-h-screen bg-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Selected Services</h1>
            <button
              onClick={() => setShowSummary(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
          </div>
          <div className="space-y-4">
            {selectedItems.length > 0 ? (
              selectedItems.map((category) => (
                <div
                  key={category.id}
                  className="bg-[#fdf7f2] rounded-xl p-4"
                >
                  <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No services selected. Please go back and select some services.</p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book a Service</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {bookingCategories.map((category) => (
            <BookingCard
              key={category.id}
              title={category.title}
              description={category.description}
              isChecked={selectedCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="bg-secondary-1 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedCategories.size === 0}
          >
            Next
          </button>
        </div>

        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedItems={selectedItems}
          onNext={handleModalNext}
        />
      </div>
    </main>
  );
}