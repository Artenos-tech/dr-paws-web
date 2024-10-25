import Image from "next/image";
import React from "react";

interface ReviewData {
  image: string;
  name: string;
  review: string;
}

interface ReviewImageCardProps {
  data: ReviewData;
}

const ReviewImageCard: React.FC<ReviewImageCardProps> = ({ data }) => {
  const { image, name, review } = data;

  return (
    <div className="max-w-sm bg-primary-3 rounded-lg overflow-hidden shadow-lg">
      {/* Image section */}
      <div className="relative h-64 w-full">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text content */}
      <div className="p-4 flex flex-col items-start">
        <div className="flex items-center justify-center mb-3">
          <span className="bg-primary-2 rounded-full w-10 h-10 mr-2"></span>
          <h3 className="text-lg italic text-gray-800">{name}</h3>
        </div>
        <p className="text-base italic text-gray-600">{review}</p>
      </div>
    </div>
  );
};

export default ReviewImageCard;
