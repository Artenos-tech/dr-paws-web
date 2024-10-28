"use client";
import { useState } from "react";

const tabs = {
  "Planned check-ups":
    "Regular check-ups and preventative measures are essential to keep your pet in the best health. Take care of any vaccinations, get any help you need, or simply visit us to ensure your pet is doing just fine!",
  "Sickness & Emergency":
    "When your pet falls ill or faces an emergency, we know it's a stressful time. We're here for you and will do our best to get your pet back to their usual happy & healthy self.",
  Diagnostics:
    "When your pet isn't feeling their best, it's important to get to the bottom of it as soon as possible. We offer a wide range of tests and scans, coupled with strong interpretation expertise to make sure the right treatment plan is offered right away.",
  "Planned surgeries":
    "Occasionally it becomes essential to take a more serious course of action to help your animal. We offer a wide range of surgical procedures to ensure your animal gets back to health, as soon as possible. Wherever we can't help, we'll refer you to a vet that can.",
  Dental:
    "Just like in humans, oral health is an essential part of making sure your animal maintains great health internally and externally. We offer a range of dental treatments to keep your animal pain-free with great hygiene.",
  Grooming:
    "Who doesn't like to see their best friend looking and feeling their best? Dr. Paws specially designed grooming studios help you take care of your animal so they turn heads and feel amazing at all times.",
  "Pet Services":
    "Occasionally it becomes essential to take a more serious course of action to help your animal. We offer a wide range of surgical procedures to ensure your animal gets back to health, as soon as possible. Wherever we can't help, we'll refer you to a vet that can.",
};

type TabName = keyof typeof tabs;

const ServicePageTab = () => {
  const [activeTab, setActiveTab] = useState<TabName>("Planned check-ups");
  return (
    <div className="w-3/5 m-auto min-h-[200px]">
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-full h-[6px] bg-primary-3"></div>
        <div className="pb-2 overflow-x-auto">
          <div className="flex items-center space-x-8 justify-start sm:justify-center">
            {Object.keys(tabs).map((tab) => (
              <button
                key={tab}
                className={`relative text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? "text-primary-1 font-semibold"
                    : "text-primary-1 font-normal"
                }`}
                onClick={() => setActiveTab(tab as TabName)}
              >
                {tab}
                {activeTab === tab && (
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
      <div className="mt-6 text-center text-neutral-600">
        <p className="max-w-lg mx-auto">{tabs[activeTab]}</p>
      </div>
    </div>
  );
};

export default ServicePageTab;
