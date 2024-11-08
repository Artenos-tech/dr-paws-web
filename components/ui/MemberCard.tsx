import Image from "next/image";
import { StaticImageData } from "next/image";
import Button from "./Button";

export interface Benefit {
  text: string;
}
export interface MembershipPlan {
  title: string;
  icon: StaticImageData;
  description: string;
  benefits: Benefit[];
  isPopular?: boolean;
}
interface MemberCardProps {
  plan: MembershipPlan;
}

export default function MemberCard({ plan }: MemberCardProps) {
  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center h-full max-w-sm">
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="bg-sky-100 w-[150px] text-sky-800 px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}

      <div className="w-20 h-20 mb-4 relative ">
        <Image
          src={plan.icon}
          alt={`${plan.title} icon`}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-2xl text-primary-1 w-full text-left mb-2 ">{plan.title}</h3>

      <p className="text-primary-1 text-sm text-left  mb-6">
        {plan.description}
      </p>

      <div className="w-full mb-4">
        <p className="text-primary-1 text-base font-bold text-start mb-2">
          Includes:
        </p>
        <ul className="space-y-2">
          {plan.benefits.map((benefit, index) => (
            <li key={index} className="text-sm text-primary-1 text-start">
              <span className="mr-2 text-primary-1">•</span>
              {benefit.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto text-base w-full ">
        {/* <button className="w-full bg-accent hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Select
        </button> */}
        <Button buttonText="Select" buttonBackground="accent" />
      </div>
    </div>
  );
}
