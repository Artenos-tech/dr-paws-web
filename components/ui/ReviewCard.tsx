import { BsFillCircleFill } from "react-icons/bs";
import { cn } from "@/lib/utils";

interface ReviewProps {
  name: string;
  review: string;
  className?: string;
}

const ReviewCard: React.FC<ReviewProps> = ({ name, review, className }) => {
  return (
    <div
      className={cn(
        `w-full bg-primary-3 p-[16px] md:p-[20px] lg:p-[24px] 
    gap-[16px] rounded-[15px] shadow-md opacity-100 flex items-center space-x-4 
    italic my-5`,
        className,
      )}
    >
      <div>
        <div
          className="review w-full  h-auto gap-0 font-[Open Sans] 
          text-[14px] md:text-[16px] lg:text-[18px] italic font-[400] leading-[1.5] 
          tracking-[-0.01em] text-left text-primary-1"
        >
          {review}
        </div>
        <div className="name flex items-center w-full  h-auto gap-[12px] pt-4">
          <BsFillCircleFill className="text-secondary-2 text-[30px] md:text-[35px] lg:text-[40px]" />
          <p className="name font-bold pl-3 text-[16px] md:text-[16px] lg:text-[18px]">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
