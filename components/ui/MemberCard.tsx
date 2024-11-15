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
  onSelect: (plan: MembershipPlan) => void;
}

export default function MemberCard({ plan, onSelect }: MemberCardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl p-3 lg:p-6 shadow-lg flex flex-col items-center h-full max-w-sm lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${
        plan.isPopular ? "border-2 border-sky-200" : ""
      }`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="bg-sky-100 text-sky-800 px-4 py-1 rounded-full text-sm font-medium w-[130px]">
            Most Popular
          </div>
        </div>
      )}

      <div className="flex flex-col h-[210px] xl:h-[240px]">
        <div className="w-20 h-20 mb-4 self-center">
          <Image
            src={plan.icon}
            alt={`${plan.title} icon`}
            className="object-contain"
          />
        </div>
        <h3 className="text-2xl text-primary-1 w-full text-left mb-2 ">
          {plan.title}
        </h3>
        <p className="text-primary-1 text-sm text-left mb-2 xl:mb-6">
          {plan.description}
        </p>
      </div>

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

      <div className="mt-auto text-base w-full mb-2 md:mb-0">
        <div onClick={() => onSelect(plan)}>
          <Button buttonText="Select" buttonBackground="bg-accent" />
        </div>
      </div>
    </div>
  );
}
