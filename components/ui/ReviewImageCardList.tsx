import React from "react";
import ReviewImageCard from "./ReviewImageCard";
import { StaticImageData } from "next/image";

interface ReviewData {
  name: string;
  review: string;
  image: string | StaticImageData;
}

interface ReviewImageCardListProps {
  reviews: ReviewData[];
}

const ReviewImageCardList: React.FC<ReviewImageCardListProps> = ({
  reviews,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {reviews.map((review, index) => (
        <ReviewImageCard key={index} data={review} />
      ))}
    </div>
  );
};

export default ReviewImageCardList;
